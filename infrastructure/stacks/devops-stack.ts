import { Stack, StackProps } from 'aws-cdk-lib';
import { CloudFrontWebDistribution } from 'aws-cdk-lib/aws-cloudfront';
import {
  Effect,
  ManagedPolicy,
  OpenIdConnectProvider,
  Policy,
  PolicyStatement,
  Role,
  ServicePrincipal,
  WebIdentityPrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';

import { Construct } from 'constructs';

interface DevopsStackProps extends StackProps {
  oidcProvider: OpenIdConnectProvider;
  webappBucket: Bucket;
  cloudfrontDistribution: CloudFrontWebDistribution;
  service: string;
  stage: string;
  githubOrg: string;
  githubRepo: string;
}

export class DevopsStack extends Stack {
  constructor(scope: Construct, id: string, props: DevopsStackProps) {
    super(scope, id, props);

    const webappDeploymentPolicy = new Policy(this, 'DeployWebappPolicy', {
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:DeleteObject', 's3:GetBucketLocation', 's3:GetObject', 's3:ListBucket', 's3:PutObject'],
          resources: [props.webappBucket.bucketArn, `${props.webappBucket.bucketArn}/*`],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['cloudfront:CreateInvalidation'],
          resources: [
            `arn:aws:cloudfront::${props.env?.account}:distribution/${props.cloudfrontDistribution.distributionId}`,
          ],
        }),
      ],
    });

    const webappDeploymentRole = new Role(this, 'GithubActionsWebappDeploymentRole', {
      roleName: `${props.service}-${props.stage}-github-actions-webapp-deployment-role`,
      assumedBy: new WebIdentityPrincipal(props.oidcProvider.openIdConnectProviderArn, {
        StringLike: {
          'token.actions.githubusercontent.com:sub': `repo:${props.githubOrg}/${props.githubRepo}:*`,
        },
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
      }),
    });

    webappDeploymentPolicy.attachToRole(webappDeploymentRole);

    const cloudformationApiDeploymentPolicy = new Policy(this, 'CloudformationDeploymentPolicy', {
      statements: [
        new PolicyStatement({
          sid: 'DeployLambdaFunctions',
          effect: Effect.ALLOW,
          actions: [
            'lambda:Get*',
            'lambda:List*',
            'lambda:CreateFunction',
            'lambda:DeleteFunction',
            'lambda:CreateFunction',
            'lambda:DeleteFunction',
            'lambda:UpdateFunctionConfiguration',
            'lambda:UpdateFunctionCode',
            'lambda:PublishVersion',
            'lambda:CreateAlias',
            'lambda:DeleteAlias',
            'lambda:UpdateAlias',
            'lambda:AddPermission',
            'lambda:RemovePermission',
            'lambda:InvokeFunction',
            'lambda:Tag*',
            'lambda:Untag*',
          ],
          resources: [`arn:aws:lambda:${props.env?.region}:${props.env?.account}:function:${props.service}*`],
        }),
        new PolicyStatement({
          sid: 'DeployLogGroups',
          effect: Effect.ALLOW,
          actions: [
            'logs:CreateLogGroup',
            'logs:Get*',
            'logs:Describe*',
            'logs:List*',
            'logs:DeleteLogGroup',
            'logs:PutResourcePolicy',
            'logs:DeleteResourcePolicy',
            'logs:PutRetentionPolicy',
            'logs:DeleteRetentionPolicy',
            'logs:TagLogGroup',
            'logs:UntagLogGroup',
          ],
          resources: [
            `arn:aws:logs:${props.env?.region}:${props.env?.account}:log-group:/aws/lambda/${props.service}*`,
            `arn:aws:logs:${props.env?.region}:${props.env?.account}:log-group:/aws/http-api/${props.service}*`,
          ],
        }),
        new PolicyStatement({
          sid: 'DescribeLogGroups',
          effect: Effect.ALLOW,
          actions: ['logs:Describe*'],
          resources: [`arn:aws:logs:${props.env?.region}:${props.env?.account}:log-group*`],
        }),
        new PolicyStatement({
          sid: 'LogDelivery',
          effect: Effect.ALLOW,
          actions: [
            'logs:CreateLogDelivery',
            'logs:DeleteLogDelivery',
            'logs:DescribeResourcePolicies',
            'logs:DescribeLogGroups',
          ],
          resources: ['*'],
        }),
        new PolicyStatement({
          sid: 'BucketPermissions',
          effect: Effect.ALLOW,
          actions: [
            's3:Get*',
            's3:List*',
            's3:CreateBucket',
            's3:DeleteBucket',
            's3:PutObject',
            's3:DeleteObject',
            's3:PutBucketPolicy',
            's3:DeleteBucketPolicy',
            's3:PutEncryptionConfiguration',
          ],
          resources: [`arn:aws:s3:::${props.service}-*`],
        }),
        new PolicyStatement({
          sid: 'LambdaExecutionRolePermissions',
          effect: Effect.ALLOW,
          actions: [
            'iam:Get*',
            'iam:List*',
            'iam:PassRole',
            'iam:CreateRole',
            'iam:DeleteRole',
            'iam:AttachRolePolicy',
            'iam:DeleteRolePolicy',
            'iam:PutRolePolicy',
            'iam:TagRole',
            'iam:UntagRole',
          ],
          resources: [`arn:aws:iam::${props.env?.account}:role/${props.service}-*`],
        }),
        new PolicyStatement({
          sid: 'ApiGatewayPermissions',
          effect: Effect.ALLOW,
          actions: ['apigateway:GET', 'apigateway:POST', 'apigateway:PUT', 'apigateway:PATCH', 'apigateway:DELETE'],
          resources: [
            `arn:aws:apigateway:${props.env?.region}::/restapis`,
            `arn:aws:apigateway:${props.env?.region}::/restapis/*`,
            `arn:aws:apigateway:${props.env?.region}::/apis`,
            `arn:aws:apigateway:${props.env?.region}::/apis/*`,
          ],
        }),
      ],
    });

    const cloudformationDeploymentRole = new Role(this, 'GithubActionsCloudformationDeploymentRole', {
      roleName: `${props.service}-${props.stage}-github-actions-cloudformation-deployment-role`,
      assumedBy: new ServicePrincipal('cloudformation.amazonaws.com'),
    });

    cloudformationApiDeploymentPolicy.attachToRole(cloudformationDeploymentRole);
    cloudformationDeploymentRole.addManagedPolicy(
      ManagedPolicy.fromManagedPolicyArn(
        this,
        'ApiGatewayCloudwatchLogsManagedPolicy',
        'arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs'
      )
    );

    const delegateToCloudformationPolicy = new Policy(this, 'CloudFormationDelegatePolicy', {
      statements: [
        new PolicyStatement({
          sid: 'DelegateToCloudFormation',
          effect: Effect.ALLOW,
          actions: ['iam:PassRole'],
          resources: [cloudformationDeploymentRole.roleArn],
        }),
      ],
    });

    const apiDeploymentPolicy = new Policy(this, 'DeployApiPolicy', {
      statements: [
        new PolicyStatement({
          sid: 'ValidateCloudFormation',
          effect: Effect.ALLOW,
          actions: ['cloudformation:ValidateTemplate'],
          resources: ['*'],
        }),
        new PolicyStatement({
          sid: 'ExecuteCloudFormation',
          effect: Effect.ALLOW,
          actions: [
            'cloudformation:CreateChangeSet',
            'cloudformation:CreateStack',
            'cloudformation:DeleteChangeSet',
            'cloudformation:DeleteStack',
            'cloudformation:DescribeChangeSet',
            'cloudformation:DescribeStackResource',
            'cloudformation:DescribeStackEvents',
            'cloudformation:DescribeStackResources',
            'cloudformation:DescribeStacks',
            'cloudformation:ExecuteChangeSet',
            'cloudformation:ListStackResources',
            'cloudformation:SetStackPolicy',
            'cloudformation:UpdateStack',
            'cloudformation:UpdateTerminationProtection',
            'cloudformation:GetTemplate',
          ],
          resources: [
            `arn:aws:cloudformation:${props.env?.region}:${props.env?.account}:stack/${props.service}-${props.stage}*`,
          ],
        }),
        new PolicyStatement({
          sid: 'ReadLambda',
          effect: Effect.ALLOW,
          actions: ['lambda:Get*', 'lambda:List*'],
          resources: ['*'],
        }),
        new PolicyStatement({
          sid: 'ManageSlsDeploymentBucket',
          effect: Effect.ALLOW,
          actions: [
            's3:CreateBucket',
            's3:DeleteBucket',
            's3:ListBucket',
            's3:PutObject',
            's3:GetObject',
            's3:DeleteObject',
            's3:GetBucketPolicy',
            's3:PutBucketPolicy',
            's3:DeleteBucketPolicy',
            's3:PutBucketAcl',
            's3:GetEncryptionConfiguration',
            's3:PutEncryptionConfiguration',
          ],
          resources: [`arn:aws:s3:::${props.service}-${props.stage}-*`],
        }),
        new PolicyStatement({
          sid: 'ListS3',
          effect: Effect.ALLOW,
          actions: ['s3:List*'],
          resources: ['*'],
        }),
        new PolicyStatement({
          sid: 'ReadSecrets',
          effect: Effect.ALLOW,
          actions: ['ssm:GetParameter'],
          resources: [
            `arn:aws:ssm:${props.env?.region}:${props.env?.account}:parameter/aws/reference/secretsmanager/${props.service}-${props.stage}-api-credentials`,
          ],
        }),
        new PolicyStatement({
          sid: 'ReadSecretsManager',
          effect: Effect.ALLOW,
          actions: ['secretsmanager:GetSecretValue'],
          resources: [`*`],
        }),
        new PolicyStatement({
          sid: 'KMS',
          effect: Effect.ALLOW,
          actions: ['kms:Decrypt', 'kms:ReEncrypt*', 'kms:CreateGrant', 'kms:DescribeKey'],
          resources: [`arn:aws:kms::${props.env?.account}:key/*`],
          conditions: {
            StringEquals: {
              'kms:CallerAccount': props.env?.account,
              'kms:ViaService': `secretsmanager.${props.env?.region}.amazonaws.com`,
            },
          },
        }),
      ],
    });

    const apiDeploymentRole = new Role(this, 'GithubActionsApiDeploymentRole', {
      roleName: `${props.service}-${props.stage}-github-actions-api-deployment-role`,
      assumedBy: new WebIdentityPrincipal(props.oidcProvider.openIdConnectProviderArn, {
        StringLike: {
          'token.actions.githubusercontent.com:sub': `repo:${props.githubOrg}/${props.githubRepo}:*`,
        },
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
      }),
    });

    delegateToCloudformationPolicy.attachToRole(apiDeploymentRole);
    apiDeploymentPolicy.attachToRole(apiDeploymentRole);
  }
}
