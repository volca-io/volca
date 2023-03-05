import { Construct } from 'constructs';
import {
  BasePathMapping,
  DomainName,
  MockIntegration,
  PassthroughBehavior,
  RestApi,
  SecurityPolicy,
} from 'aws-cdk-lib/aws-apigateway';
import { ARecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { Environment } from '../../config/types';
import { CertificateValidation, DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiGatewayDomain } from 'aws-cdk-lib/aws-route53-targets';

export interface ApiGatewayProps {
  name: string;
  environment: Environment;
  hostedZone: IHostedZone;
  subdomain?: string;
}

export class ApiGateway extends Construct {
  public restApiId: string;
  public rootResourceId: string;
  public domainName: string;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    this.domainName = props.subdomain
      ? `api.${props.subdomain}.${props.hostedZone.zoneName}`
      : `api.${props.hostedZone.zoneName}`;

    const api = new RestApi(this, `${props.name}-${props.environment}-api-gateway`, {
      deploy: true,
      deployOptions: {
        stageName: props.environment,
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

    const certificate = new DnsValidatedCertificate(this, 'Certificate', {
      domainName: this.domainName,
      validation: CertificateValidation.fromDns(props.hostedZone),
      hostedZone: props.hostedZone,
      cleanupRoute53Records: true,
    });

    const apiGatewayDomainName = new DomainName(this, 'DomainName', {
      domainName: this.domainName,
      certificate,
      securityPolicy: SecurityPolicy.TLS_1_2,
    });

    new BasePathMapping(this, 'BasePathMapping', {
      domainName: apiGatewayDomainName,
      restApi: api,
      stage: api.deploymentStage,
    });

    new ARecord(this, 'ApiARecord', {
      zone: props.hostedZone,
      recordName: this.domainName,
      target: RecordTarget.fromAlias(new ApiGatewayDomain(apiGatewayDomainName)),
    });

    this.restApiId = api.restApiId;
    this.rootResourceId = api.restApiRootResourceId;
  }
}
