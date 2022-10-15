import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc, SubnetType } from 'aws-cdk-lib/aws-ec2';

import { Construct } from 'constructs';

interface VpcStackProps extends StackProps {
  service: string;
  stage: string;
}

export class VpcStack extends Stack {
  public vpc: Vpc;

  constructor(scope: Construct, id: string, props: VpcStackProps) {
    super(scope, id, props);

    this.vpc = new Vpc(this, 'ApplicationVpc', {
      cidr: '10.0.0.0/16',
      maxAzs: 3,
      natGateways: 0,
      vpcName: `${props.service}-${props.stage}-vpc`,
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'private',
          subnetType: SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });
  }
}
