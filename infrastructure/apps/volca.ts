#!/usr/bin/env node
import { App, Tags } from 'aws-cdk-lib';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { config } from '../../volca.config';
import { ApiStack } from '../stacks/api-stack';
import { RoutingStack } from '../stacks/routing-stack';
import { VpcStack } from '../stacks/vpc-stack';
import { WebappStack } from '../stacks/webapp-stack';

const app = new App();

const stage = app.node.tryGetContext('stage') as string;
const environmentConfig = config.environments[stage];

const serviceName = config.name;

if (!environmentConfig) {
  throw new Error(`Failed to read environment configuration from "volca.config.ts" for stage ${stage}`);
}

const { aws, domain } = environmentConfig;

const vpcStack = new VpcStack(app, `${serviceName}-${stage}-vpc-stack`, {
  service: serviceName,
  stage,
  env: aws,
  strategy: aws.stackStrategy,
});

Tags.of(vpcStack).add('service', serviceName);
Tags.of(vpcStack).add('stage', stage);

let hostedZone: IHostedZone | null = null;
if (domain) {
  const routingStack = new RoutingStack(app, `${serviceName}-${stage}-routing-stack`, {
    service: serviceName,
    stage,
    domain,
    env: aws,
  });

  hostedZone = routingStack.hostedZone;

  Tags.of(routingStack).add('service', serviceName);
  Tags.of(routingStack).add('stage', stage);
}

const apiStack = new ApiStack(app, `${serviceName}-${stage}-api-stack`, {
  service: serviceName,
  stage,
  env: aws,
  strategy: aws.stackStrategy,
  vpc: vpcStack.vpc,
  hostedZone,
});

Tags.of(apiStack).add('service', serviceName);
Tags.of(apiStack).add('stage', stage);

const webappStack = new WebappStack(app, `${serviceName}-${stage}-webapp-stack`, {
  service: serviceName,
  stage,
  env: aws,
  hostedZone,
});

Tags.of(webappStack).add('service', serviceName);
Tags.of(webappStack).add('stage', stage);
