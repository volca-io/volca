import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ARecord, CnameRecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import {
  UserPool,
  VerificationEmailStyle,
  Mfa,
  UserPoolEmail,
  OAuthScope,
  UserPoolClientIdentityProvider,
  UserPoolIdentityProviderGoogle,
  ProviderAttribute,
  UserPoolIdentityProviderFacebook,
  UserPoolIdentityProviderApple,
  IUserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';

import { AuthenticationConfig, Environment } from '../../config/types';
import { CertificateValidation, DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

interface CognitoProps {
  name: string;
  environment: Environment;
  fromEmail: string;
  hostedZone: IHostedZone;
  domain: string;
  authenticationConfig: AuthenticationConfig;
}

export class Cognito extends Construct {
  public userPool: IUserPool;
  public userPoolAppClient: UserPoolClient;

  constructor(scope: Construct, id: string, props: CognitoProps) {
    super(scope, id);

    new ARecord(this, 'CognitoRootDomainPlaceholder', {
      recordName: props.domain,
      target: RecordTarget.fromIpAddresses('8.8.8.8'),
      zone: props.hostedZone,
    });

    this.userPool = new UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: `Your ${props.name} verification code`,
        emailBody: 'Hi there, your verification code is: <b>{####}</b>',
        emailStyle: VerificationEmailStyle.CODE,
        smsMessage: `Hi there, your verification code is: <b>{####}</b>'`,
      },

      signInAliases: {
        email: true,
        username: false,
        phone: false,
        preferredUsername: false,
      },
      mfa: Mfa.OFF,
      passwordPolicy: {
        minLength: 12,
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
        tempPasswordValidity: Duration.days(7),
      },
      email: UserPoolEmail.withSES({
        fromEmail: props.fromEmail,
        sesVerifiedDomain: props.fromEmail.split('@')[1],
        fromName: props.name,
        replyTo: props.fromEmail,
      }),
    });

    const domainName = `login.${props.domain}`;

    const certificate = new DnsValidatedCertificate(this, 'CognitoCertificate', {
      domainName,
      subjectAlternativeNames: [`www.${domainName}`],
      validation: CertificateValidation.fromDns(props.hostedZone),
      region: 'us-east-1',
      hostedZone: props.hostedZone,
      cleanupRoute53Records: true,
    });

    const domain = this.userPool.addDomain('CognitoDomain', {
      customDomain: {
        domainName,
        certificate,
      },
    });

    new CnameRecord(this, 'CognitoCustomDomainCloudFrontCname', {
      recordName: domainName,
      zone: props.hostedZone,
      domainName: domain.cloudFrontDomainName,
    });

    const appDomain = `app.${props.domain}`;

    this.userPoolAppClient = this.userPool.addClient('webapp-client', {
      authFlows: {
        userSrp: true,
      },
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.COGNITO,
        ...(props.authenticationConfig.identityProviders?.google ? [UserPoolClientIdentityProvider.GOOGLE] : []),
        ...(props.authenticationConfig.identityProviders?.facebook ? [UserPoolClientIdentityProvider.FACEBOOK] : []),
        ...(props.authenticationConfig.identityProviders?.apple ? [UserPoolClientIdentityProvider.APPLE] : []),
      ],
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.OPENID, OAuthScope.EMAIL, OAuthScope.PROFILE],
        callbackUrls: props.authenticationConfig.allowLocalhost
          ? [`https://${appDomain}`, 'http://localhost:3000']
          : [`https://${appDomain}`],
        logoutUrls: props.authenticationConfig.allowLocalhost
          ? [`https://${appDomain}`, 'http://localhost:3000']
          : [`https://${appDomain}`],
      },
    });

    if (props.authenticationConfig.identityProviders?.google) {
      const { clientId, clientSecretSsmPath } = props.authenticationConfig.identityProviders.google;

      if (!clientSecretSsmPath) {
        throw new Error('Deploying the Google identity provider requires you to specify the secret in an SSM variable');
      }

      const googleIdp = new UserPoolIdentityProviderGoogle(this, 'GoogleIdentityProvider', {
        clientId,
        clientSecret: StringParameter.valueForStringParameter(this, clientSecretSsmPath), // Note: This will expose the private key in cloudformation templates, but there is nosecure way of passing it
        userPool: this.userPool,
        scopes: ['openid', 'email', 'profile'],
        attributeMapping: {
          email: ProviderAttribute.GOOGLE_EMAIL,
          givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
          familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
          profilePicture: ProviderAttribute.GOOGLE_PICTURE,
        },
      });

      this.userPoolAppClient.node.addDependency(googleIdp);
    }

    if (props.authenticationConfig.identityProviders?.facebook) {
      const { clientId, clientSecretSsmPath } = props.authenticationConfig.identityProviders.facebook;

      if (!clientSecretSsmPath) {
        throw new Error(
          'Deploying the Facebook identity provider requires you to specify the secret in an SSM variable'
        );
      }

      const facebookIdp = new UserPoolIdentityProviderFacebook(this, 'FacebookIdentityProvider', {
        clientId,
        clientSecret: StringParameter.valueForStringParameter(this, clientSecretSsmPath), // Note: This will expose the private key in cloudformation templates, but there is nosecure way of passing it
        userPool: this.userPool,
        scopes: ['openid', 'email', 'public_profile'],
        attributeMapping: {
          email: ProviderAttribute.FACEBOOK_EMAIL,
          givenName: ProviderAttribute.FACEBOOK_FIRST_NAME,
          familyName: ProviderAttribute.FACEBOOK_LAST_NAME,
          profilePicture: ProviderAttribute.other('picture'),
        },
      });

      this.userPoolAppClient.node.addDependency(facebookIdp);
    }

    if (props.authenticationConfig.identityProviders?.apple) {
      const { clientId, teamId, keyId, privateKeySsmPath } = props.authenticationConfig.identityProviders.apple;

      if (!privateKeySsmPath) {
        throw new Error(
          'Deploying the Apple identity provider requires you to specify the private key in an SSM variable'
        );
      }

      const appleIdp = new UserPoolIdentityProviderApple(this, 'AppleIdentityProvider', {
        clientId,
        teamId,
        userPool: this.userPool,
        keyId,
        privateKey: StringParameter.valueForStringParameter(this, privateKeySsmPath), // Note: This will expose the private key in cloudformation templates, but there is nosecure way of passing it
        scopes: ['email', 'name'],
        attributeMapping: {
          email: ProviderAttribute.APPLE_EMAIL,
          givenName: ProviderAttribute.APPLE_FIRST_NAME,
          familyName: ProviderAttribute.APPLE_LAST_NAME,
        },
      });

      this.userPoolAppClient.node.addDependency(appleIdp);
    }

    domain.signInUrl(this.userPoolAppClient, {
      redirectUri: `https://${appDomain}`,
    });
  }
}
