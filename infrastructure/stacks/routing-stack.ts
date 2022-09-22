import { VerifySesEmailAddress } from '@seeebiii/ses-verify-identities';

import { CfnOutput, Stack, StackProps, Fn } from 'aws-cdk-lib';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

interface RoutingStackProps extends StackProps {
  service: string;
  stage: string;
  domain?: string;
  email?: string;
}

export class RoutingStack extends Stack {
  public hostedZone: HostedZone;

  constructor(scope: Construct, id: string, props: RoutingStackProps) {
    super(scope, id, props);

    if (!props.domain) {
      throw new Error('Can not deploy routing stack without a domain. Please add a domain to volca.config.ts');
    }

    this.hostedZone = new HostedZone(this, 'HostedZone', { zoneName: props.domain });

    if (props.email) {
      new VerifySesEmailAddress(this, 'SesEmailVerificatoion', {
        emailAddress: props.email,
      });
    }

    if (this.hostedZone.hostedZoneNameServers) {
      new CfnOutput(this, 'NameServers', { value: Fn.join(', ', this.hostedZone.hostedZoneNameServers) });
    }
  }
}
