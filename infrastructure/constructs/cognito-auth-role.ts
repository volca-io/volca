import { CfnIdentityPool, CfnIdentityPoolRoleAttachment } from 'aws-cdk-lib/aws-cognito';
import { Effect, FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

type CognitoAuthRoleProps = {
  identityPool: CfnIdentityPool;
};

export default class CognitoAuthRole extends Construct {
  public role: Role;

  constructor(scope: Construct, id: string, props: CognitoAuthRoleProps) {
    super(scope, id);

    const { identityPool } = props;

    const principal = new FederatedPrincipal(
      'cognito-identity.amazonaws.com',
      {
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': identityPool.ref,
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated',
        },
      },
      'sts:AssumeRoleWithWebIdentity'
    );

    this.role = new Role(this, 'CognitoDefaultAuthenticatedRole', {
      assumedBy: principal.withSessionTags(),
    });

    this.role.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['cognito-identity:GetCredentialsForIdentity'],
        resources: ['*'],
      })
    );

    new CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
      identityPoolId: identityPool.ref,
      roles: { authenticated: this.role.roleArn },
    });
  }
}
