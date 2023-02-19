import { Stack, StackProps, RemovalPolicy, CfnOutput, SecretValue } from 'aws-cdk-lib';
import { DatabaseInstanceEngine, DatabaseInstance, PostgresEngineVersion, SubnetGroup } from 'aws-cdk-lib/aws-rds';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import {
  IVpc,
  InstanceType,
  InstanceClass,
  InstanceSize,
  SubnetType,
  SecurityGroup,
  Peer,
  Port,
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import {
  BasePathMapping,
  DomainName,
  MockIntegration,
  PassthroughBehavior,
  RestApi,
  SecurityPolicy,
} from 'aws-cdk-lib/aws-apigateway';
import { CertificateValidation, DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGatewayDomain } from 'aws-cdk-lib/aws-route53-targets';

import { Effect, ManagedPolicy, Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Environment } from '../../config/types';

interface ApiStackProps extends StackProps {
  service: string;
  stage: Environment;
  vpc: IVpc;
  hostedZone: IHostedZone | null;
  publicDatabase: boolean;
  dbUsername: string;
  dbPassword: SecretValue;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const engine = DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_14_2 });
    const instanceType = InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO);
    const subnetGroup = new SubnetGroup(this, 'ApiDatabaseSubnetGroup', {
      vpc: props.vpc,
      removalPolicy: RemovalPolicy.DESTROY,
      description: 'Subnet group for api database',
      vpcSubnets: {
        subnetType: props.publicDatabase ? SubnetType.PUBLIC : SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    const rdsSecurityGroup = new SecurityGroup(this, 'DatabaseSecurityGroup', {
      description: 'Allows access to the RDS cluster',
      allowAllOutbound: true,
      vpc: props.vpc,
    });

    const apiSecurityGroup = new SecurityGroup(this, 'ApiSecurityGroup', {
      description: 'Security group for lambda funcitons',
      allowAllOutbound: true,
      vpc: props.vpc,
    });

    apiSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.allTcp(), 'All inbound');

    rdsSecurityGroup.addIngressRule(
      props.publicDatabase ? Peer.anyIpv4() : apiSecurityGroup,
      Port.tcp(5432),
      'Postgres database access'
    );

    const database = new DatabaseInstance(this, 'ApiDatabase', {
      engine,
      vpc: props.vpc,
      credentials: {
        username: props.dbUsername,
        password: props.dbPassword,
      },
      copyTagsToSnapshot: true,
      instanceType,
      subnetGroup,
      publiclyAccessible: props.publicDatabase,
      securityGroups: [rdsSecurityGroup],
      allocatedStorage: 20,
    });

    const api = new RestApi(this, `${props.service}-${props.stage}-api-gateway`, {
      deploy: true,
      deployOptions: {
        stageName: props.stage,
      },
    });

    const ping = api.root.addResource('ping');

    ping.addMethod(
      'GET',
      new MockIntegration({
        integrationResponses: [{ statusCode: '200' }],
        passthroughBehavior: PassthroughBehavior.NEVER,
        requestTemplates: {
          'application/json': '{ "statusCode": 200 }',
        },
      }),
      {
        methodResponses: [{ statusCode: '200' }],
      }
    );

    if (props.hostedZone) {
      const certificate = new DnsValidatedCertificate(this, 'Certificate', {
        domainName: `api.${props.hostedZone.zoneName}`,
        validation: CertificateValidation.fromDns(props.hostedZone),
        hostedZone: props.hostedZone,
        cleanupRoute53Records: true,
      });

      const domainName = new DomainName(this, 'DomainName', {
        domainName: `api.${props.hostedZone.zoneName}`,
        certificate,
        securityPolicy: SecurityPolicy.TLS_1_2,
      });

      new BasePathMapping(this, 'BasePathMapping', {
        domainName: domainName,
        restApi: api,
        stage: api.deploymentStage,
      });

      new ARecord(this, 'ApiARecord', {
        zone: props.hostedZone,
        recordName: `api.${props.hostedZone.zoneName}`,
        target: RecordTarget.fromAlias(new ApiGatewayDomain(domainName)),
      });
    }

    new CfnOutput(this, 'ApiGatewayID', { value: api.restApiId });
    new CfnOutput(this, 'ApiGatewayRootResourceID', { value: api.restApiRootResourceId });

    if (props.hostedZone) {
      new CfnOutput(this, 'ApiDomain', { value: `api.${props.hostedZone.zoneName}` });
    } else {
      new CfnOutput(this, 'ApiDomain', { value: api.url });
    }

    const lambdaExecutionPolicy = new Policy(this, 'ApiLambdaExecutionPolicy', {
      statements: [
        new PolicyStatement({
          sid: 'SendEmails',
          effect: Effect.ALLOW,
          actions: ['ses:SendEmail'],
          resources: [`arn:aws:ses:${props.env?.region}:${props.env?.account}:identity/*`],
        }),
        new PolicyStatement({
          sid: 'CreateLogGroups',
          effect: Effect.ALLOW,
          actions: ['logs:CreateLogStream', 'logs:CreateLogGroup'],
          resources: [
            `arn:aws:logs:${props.env?.region}:${props.env?.account}:log-group:/aws/lambda/${props.service}-api-${props.stage}*:*`,
          ],
        }),
        new PolicyStatement({
          sid: 'PutLogs',
          effect: Effect.ALLOW,
          actions: ['logs:PutLogEvents', 'logs:CreateLogGroup'],
          resources: [
            `arn:aws:logs:${props.env?.region}:${props.env?.account}:log-group:/aws/lambda/${props.service}-api-${props.stage}*:*:*`,
          ],
        }),
      ],
    });

    const lambdaExecutionRole = new Role(this, 'ApiLambdaExecutionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaExecutionRole.attachInlinePolicy(lambdaExecutionPolicy);
    if (!props.publicDatabase) {
      lambdaExecutionRole.addManagedPolicy(
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole')
      );
    }

    new StringParameter(this, 'DbHost', {
      parameterName: `/${props.stage}/DB_HOST`,
      stringValue: database.dbInstanceEndpointAddress,
    });
    new CfnOutput(this, 'LambdaExecutionRole', { value: lambdaExecutionRole.roleArn });
    new CfnOutput(this, 'ApiSecurityGroupOutput', { value: apiSecurityGroup.securityGroupId });
  }
}
