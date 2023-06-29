import { Stack, StackProps } from 'aws-cdk-lib';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';

import { Construct } from 'constructs';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';

interface CertificateStackProps extends StackProps {
  hostedZone: IHostedZone;
  subdomain?: string;
}

export class GlobalCertificateStack extends Stack {
  public cognitoCertificate: Certificate;
  public webappCertificate: Certificate;

  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, props);

    const cognitoDomainName = props.subdomain
      ? `login.${props.subdomain}.${props.hostedZone.zoneName}`
      : `login.${props.hostedZone.zoneName}`;
    this.cognitoCertificate = new Certificate(this, 'CognitoCertificate', {
      domainName: cognitoDomainName,
      subjectAlternativeNames: [`www.${cognitoDomainName}`],
      validation: CertificateValidation.fromDns(props.hostedZone),
    });

    const webappDomainName = props.subdomain
      ? `app.${props.subdomain}.${props.hostedZone.zoneName}`
      : `app.${props.hostedZone.zoneName}`;
    this.webappCertificate = new Certificate(this, 'WebappCertificate', {
      domainName: webappDomainName,
      subjectAlternativeNames: [`www.${webappDomainName}`],
      validation: CertificateValidation.fromDns(props.hostedZone),
    });
  }
}
