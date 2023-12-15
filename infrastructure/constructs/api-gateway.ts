import { Construct } from 'constructs';
import { BasePathMapping, DomainName, RestApi, SecurityPolicy } from 'aws-cdk-lib/aws-apigateway';
import { ARecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { Environment } from '../../types/types';
import { CertificateValidation, Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiGatewayDomain } from 'aws-cdk-lib/aws-route53-targets';

export interface ApiGatewayProps {
  name: string;
  environment: Environment;
  hostedZone: IHostedZone;
  domain: string;
}

export class ApiGateway extends Construct {
  public domainName: string;
  public rootResource;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    this.domainName = `api.${props.domain}`;

    const api = new RestApi(this, `${props.name}-${props.environment}-api-gateway`, {
      deploy: true,
      deployOptions: {
        stageName: props.environment,
      },
    });

    const certificate = new Certificate(this, 'Certificate', {
      domainName: this.domainName,
      validation: CertificateValidation.fromDns(props.hostedZone),
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

    this.rootResource = api.root;
  }
}
