import { Construct } from 'constructs';
import { Effect, ManagedPolicy, Policy, PolicyStatement, Role, ServicePrincipal, IRole } from 'aws-cdk-lib/aws-iam';
import { Environment } from '../../types/types';

export interface ApiLambdaExecutionRoleProps {
  name: string;
  environment: Environment;
  publicDatabase: boolean;
  region: string;
  account: string;
}

export class ApiLambdaExecutionRole extends Construct {
  public role: IRole;

  constructor(scope: Construct, id: string, props: ApiLambdaExecutionRoleProps) {
    super(scope, id);

    const lambdaExecutionPolicy = new Policy(this, 'ApiLambdaExecutionPolicy', {
      statements: [
        new PolicyStatement({
          sid: 'SendEmails',
          effect: Effect.ALLOW,
          actions: ['ses:SendEmail'],
          resources: [`arn:aws:ses:${props.region}:${props.account}:identity/*`],
        }),
        new PolicyStatement({
          sid: 'CreateLogGroups',
          effect: Effect.ALLOW,
          actions: ['logs:CreateLogStream', 'logs:CreateLogGroup'],
          resources: [
            `arn:aws:logs:${props.region}:${props.account}:log-group:/aws/lambda/${props.name}-api-${props.environment}*:*`,
          ],
        }),
        new PolicyStatement({
          sid: 'PutLogs',
          effect: Effect.ALLOW,
          actions: ['logs:PutLogEvents', 'logs:CreateLogGroup'],
          resources: [
            `arn:aws:logs:${props.region}:${props.account}:log-group:/aws/lambda/${props.name}-api-${props.environment}*:*:*`,
          ],
        }),
        new PolicyStatement({
          sid: 'VpcPermissions',
          effect: Effect.ALLOW,
          actions: [
            'ec2:DescribeNetworkInterfaces',
            'ec2:CreateNetworkInterface',
            'ec2:DeleteNetworkInterface',
            'ec2:DescribeInstances',
            'ec2:AttachNetworkInterface',
          ],
          resources: ['*'],
        }),
        new PolicyStatement({
          sid: 'SsmPermissions',
          effect: Effect.ALLOW,
          actions: ['ssm:GetParameter', 'ssm:GetParametersByPath'],
          resources: [`arn:aws:ssm:${props.region}:${props.account}:parameter/${props.name}/${props.environment}/*`],
        }),
      ],
    });

    const lambdaExecutionRole = new Role(this, 'ApiLambdaExecutionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaExecutionRole.attachInlinePolicy(lambdaExecutionPolicy);

    this.role = lambdaExecutionRole;

    lambdaExecutionRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole')
    );
  }
}
