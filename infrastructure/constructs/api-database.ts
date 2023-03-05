import { DatabaseInstanceEngine, DatabaseInstance, PostgresEngineVersion, SubnetGroup } from 'aws-cdk-lib/aws-rds';
import {
  InstanceType,
  InstanceClass,
  InstanceSize,
  SubnetType,
  SecurityGroup,
  Peer,
  Port,
  IVpc,
  ISecurityGroup,
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { RemovalPolicy, SecretValue } from 'aws-cdk-lib';

export interface DatabaseProps {
  vpc: IVpc;
  public: boolean;
  username: string;
  password: SecretValue;
  apiSecurityGroup: ISecurityGroup;
}

export class Database extends Construct {
  public endpointAddress: string;

  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id);

    const engine = DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_14_2 });
    const instanceType = InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO);
    const subnetGroup = new SubnetGroup(this, 'ApiDatabaseSubnetGroup', {
      vpc: props.vpc,
      removalPolicy: RemovalPolicy.DESTROY,
      description: 'Subnet group for api database',
      vpcSubnets: {
        subnetType: props.public ? SubnetType.PUBLIC : SubnetType.PRIVATE_WITH_EGRESS,
      },
    });

    const rdsSecurityGroup = new SecurityGroup(this, 'DatabaseSecurityGroup', {
      description: 'Allows access to the RDS cluster',
      allowAllOutbound: true,
      vpc: props.vpc,
    });

    props.apiSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.allTcp(), 'All inbound');

    rdsSecurityGroup.addIngressRule(
      props.public ? Peer.anyIpv4() : props.apiSecurityGroup,
      Port.tcp(5432),
      'Postgres database access'
    );

    const database = new DatabaseInstance(this, 'ApiDatabase', {
      engine,
      vpc: props.vpc,
      credentials: {
        username: props.username,
        password: props.password,
      },
      copyTagsToSnapshot: true,
      instanceType,
      subnetGroup,
      publiclyAccessible: props.public,
      securityGroups: [rdsSecurityGroup],
      allocatedStorage: 20,
    });

    this.endpointAddress = database.dbInstanceEndpointAddress;
  }
}
