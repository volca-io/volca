import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Vpc, SubnetType } from 'aws-cdk-lib/aws-ec2';

import { Construct } from 'constructs';

interface VpcStackProps extends StackProps {
  service: string;
  stage: string;
  publicDatabase: boolean;
}

export class VpcStack extends Stack {
  public vpc: Vpc;

  constructor(scope: Construct, id: string, props: VpcStackProps) {
    super(scope, id, props);

    this.vpc = new Vpc(this, 'ApplicationVpc', {
      cidr: '10.0.0.0/16',
      maxAzs: 3,
      natGateways: props.publicDatabase ? 0 : 1,
      vpcName: `${props.service}-${props.stage}-vpc`,
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: 'isolated',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        {
          name: 'private',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    new CfnOutput(this, 'PublicSubnets', { value: this.vpc.publicSubnets.map((subnet) => subnet.subnetId).join(', ') });
    new CfnOutput(this, 'PrivateSubnets', {
      value: this.vpc.privateSubnets.map((subnet) => subnet.subnetId).join(', '),
    });
    new CfnOutput(this, 'IsolatedSubnets', {
      value: this.vpc.isolatedSubnets.map((subnet) => subnet.subnetId).join(', '),
    });
  }
}
