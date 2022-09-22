#!/usr/bin/env node
import { App, Tags } from 'aws-cdk-lib';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Environment } from '../../types/volca';
import { config } from '../../volca.config';
import { AccountBootstrapStack } from '../stacks/account-bootstrap-stack';
import { ApiStack } from '../stacks/api-stack';
import { DevopsStack } from '../stacks/devops-stack';
import { RoutingStack } from '../stacks/routing-stack';
import { VpcStack } from '../stacks/vpc-stack';
import { WebappStack } from '../stacks/webapp-stack';

const app = new App();

const stage = app.node.tryGetContext('stage') as Environment;
const environmentConfig = config.environments[stage];

const { name: serviceName, github } = config;

if (!environmentConfig) {
  throw new Error(
    `Failed to read environment configuration from "volca.config.ts" for stage ${stage}. The environment does not exist or is not deployable.`
  );
}

const { aws, domain } = environmentConfig;

const accountBootstrapStack = new AccountBootstrapStack(app, `${serviceName}-account-bootstrap-stack`, {
  env: aws,
});

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
    email: environmentConfig.fromEmail,
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

const devopsStack = new DevopsStack(app, `${serviceName}-${stage}-devops-stack`, {
  oidcProvider: accountBootstrapStack.provider,
  webappBucket: webappStack.bucket,
  cloudfrontDistribution: webappStack.distribution,
  service: serviceName,
  stage,
  githubOrg: github.organization,
  githubRepo: github.repository,
  env: aws,
});

Tags.of(devopsStack).add('service', serviceName);
Tags.of(devopsStack).add('stage', stage);
