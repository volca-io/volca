import { Construct } from 'constructs';
import { Effect, IRole, ManagedPolicy, Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export interface DeploymentPolicyProps {
  name: string;
  region: string;
  account: string;
  deploymentRole: IRole;
}

export class DeploymentPolicy extends Construct {
  public cloudformationDeploymentRoleArn;

  constructor(scope: Construct, id: string, props: DeploymentPolicyProps) {
    super(scope, id);

    const cloudformationDeploymentPolicy = new Policy(this, 'CloudformationDeploymentPolicy', {
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
          resources: [`arn:aws:lambda:${props.region}:${props.account}:function:${props.name}*`],
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
            `arn:aws:logs:${props.region}:${props.account}:log-group:/aws/lambda/${props.name}*`,
            `arn:aws:logs:${props.region}:${props.account}:log-group:/aws/http-api/${props.name}*`,
          ],
        }),
        new PolicyStatement({
          sid: 'DescribeLogGroups',
          effect: Effect.ALLOW,
          actions: ['logs:Describe*'],
          resources: [`arn:aws:logs:${props.region}:${props.account}:log-group*`],
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
          resources: [`arn:aws:s3:::${props.name}-*`],
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
          resources: [`arn:aws:iam::${props.account}:role/${props.name}-*`],
        }),
        new PolicyStatement({
          sid: 'ApiGatewayPermissions',
          effect: Effect.ALLOW,
          actions: ['apigateway:GET', 'apigateway:POST', 'apigateway:PUT', 'apigateway:PATCH', 'apigateway:DELETE'],
          resources: [
            `arn:aws:apigateway:${props.region}::/restapis`,
            `arn:aws:apigateway:${props.region}::/restapis/*`,
            `arn:aws:apigateway:${props.region}::/apis`,
            `arn:aws:apigateway:${props.region}::/apis/*`,
          ],
        }),
        new PolicyStatement({
          sid: 'DescribeSecurityGroups',
          effect: Effect.ALLOW,
          actions: ['ec2:DescribeVpcs', 'ec2:DescribeSecurityGroups', 'ec2:DescribeSubnets'],
          resources: ['*'],
        }),
      ],
    });

    const cloudformationDeploymentRole = new Role(this, 'GithubActionsCloudformationDeploymentRole', {
      roleName: `${props.name}-github-actions-cloudformation-deployment-role`,
      assumedBy: new ServicePrincipal('cloudformation.amazonaws.com'),
    });

    cloudformationDeploymentPolicy.attachToRole(cloudformationDeploymentRole);
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

    const policy = new Policy(this, 'DeploymentPolicy', {
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
            `arn:aws:cloudformation:${props.region}:${props.account}:stack/${props.name}-*`,
            `arn:aws:cloudformation:${props.region}:${props.account}:stack/CDKToolkit/*`,
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
            's3:GetBucketLocation',
          ],
          resources: [`arn:aws:s3:::${props.name}-*`],
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
          actions: ['ssm:GetParameter', 'ssm:GetParameters'],
          resources: [
            `arn:aws:ssm:${props.region}:${props.account}:parameter/${props.name}/*`,
            `arn:aws:ssm:${props.region}:${props.account}:parameter/cdk-bootstrap/*`,
          ],
        }),
        new PolicyStatement({
          sid: 'KMS',
          effect: Effect.ALLOW,
          actions: ['kms:Decrypt', 'kms:ReEncrypt*', 'kms:CreateGrant', 'kms:DescribeKey'],
          resources: [`arn:aws:kms::${props.account}:key/*`],
          conditions: {
            StringEquals: {
              'kms:CallerAccount': props.account,
              'kms:ViaService': `secretsmanager.${props.region}.amazonaws.com`,
            },
          },
        }),
        new PolicyStatement({
          sid: 'Lambda',
          effect: Effect.ALLOW,
          actions: ['lambda:Update*', 'lambda:InvokeFunction'],
          resources: [`arn:aws:lambda:${props.region}:${props.account}:function:${props.name}-api-*-migrate`],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['cloudfront:ListDistributions'],
          resources: [`*`],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['cloudfront:CreateInvalidation'],
          resources: ['*'],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['sts:AssumeRole', 'iam:PassRole'],
          resources: [`arn:aws:iam::${props.account}:role/cdk-hnb659fds-*`],
        }),
      ],
    });

    delegateToCloudformationPolicy.attachToRole(props.deploymentRole);
    policy.attachToRole(props.deploymentRole);

    this.cloudformationDeploymentRoleArn = cloudformationDeploymentRole.roleArn;
  }
}
