import { Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import {
  OriginAccessIdentity,
  CloudFrontWebDistribution,
  ViewerCertificate,
  SecurityPolicyProtocol,
  SSLMethod,
} from 'aws-cdk-lib/aws-cloudfront';

import { Construct } from 'constructs';
import { CertificateValidation, DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

interface WebappStackProps extends StackProps {
  service: string;
  stage: string;
  hostedZone: IHostedZone | null;
}

export class WebappStack extends Stack {
  public distribution: CloudFrontWebDistribution;

  constructor(scope: Construct, id: string, props: WebappStackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'WebappHostingBucket', {
      bucketName: `${props.service}-${props.stage}-webapp-hosting-bucket`, // TODO - Append random characters to end to enforce uniqueness
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      blockPublicAccess: new BlockPublicAccess({ restrictPublicBuckets: false }),
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const oai = new OriginAccessIdentity(this, 'WebappCloudFrontOriginAccessIdentity');
    bucket.grantRead(oai.grantPrincipal);

    let certificate: DnsValidatedCertificate | null = null;
    if (props.hostedZone) {
      certificate = new DnsValidatedCertificate(this, 'Certificate', {
        domainName: props.hostedZone.zoneName,
        subjectAlternativeNames: [`app.${props.hostedZone.zoneName}`, `www.app.${props.hostedZone.zoneName}`],
        validation: CertificateValidation.fromDns(props.hostedZone),
        region: 'us-east-1',
        hostedZone: props.hostedZone,
        cleanupRoute53Records: true,
      });
    }

    const distribution = new CloudFrontWebDistribution(this, 'WebappDistribution', {
      viewerCertificate:
        props.hostedZone && certificate
          ? ViewerCertificate.fromAcmCertificate(certificate, {
              aliases: [`app.${props.hostedZone.zoneName}`, `www.app.${props.hostedZone.zoneName}`],
              securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2021,
              sslMethod: SSLMethod.SNI,
            })
          : undefined,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: oai,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 404,
          errorCachingMinTtl: 300,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    bucket.grantRead(oai.grantPrincipal);

    if (props.hostedZone) {
      new ARecord(this, 'WebappARecord', {
        target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
        zone: props.hostedZone,
        recordName: `app.${props.hostedZone.zoneName}`,
      });
    }

    new CfnOutput(this, 'CloudFrontID', { value: distribution.distributionId });
    new CfnOutput(this, 'AppDomain', {
      value: props.hostedZone ? `app.${props.hostedZone.zoneName}` : distribution.distributionDomainName,
    });

    this.distribution = distribution;
  }
}
