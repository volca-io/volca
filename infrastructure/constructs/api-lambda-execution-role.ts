import { Construct } from 'constructs';
import { Environment } from '../../config/types';
import { Effect, ManagedPolicy, Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export interface ApiLambdaExecutionRoleProps {
  name: string;
  environment: Environment;
  publicDatabase: boolean;
  region: string;
  account: string;
}

export class ApiLambdaExecutionRole extends Construct {
  public roleArn: string;

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
      ],
    });

    const lambdaExecutionRole = new Role(this, 'ApiLambdaExecutionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaExecutionRole.attachInlinePolicy(lambdaExecutionPolicy);

    this.roleArn = lambdaExecutionRole.roleArn;

    if (!props.publicDatabase) {
      lambdaExecutionRole.addManagedPolicy(
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole')
      );
    }
  }
}
