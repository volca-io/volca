#!/usr/bin/env node
import { App, Tags } from 'aws-cdk-lib';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { DeployableEnvironmentConfig, Environment } from '../../types/volca';
import { config } from '../../volca.config';
import { AccountBootstrapStack } from '../stacks/account-bootstrap-stack';
import { ApiStack } from '../stacks/api-stack';
import { DevopsStack } from '../stacks/devops-stack';
import { RoutingStack } from '../stacks/routing-stack';
import { VpcStack } from '../stacks/vpc-stack';
import { WebappStack } from '../stacks/webapp-stack';

const app = new App();

const stage = app.node.tryGetContext('stage') as Environment;

if (!config.environments[stage] || !config.environments[stage].aws) {
  throw new Error(
    `Failed to read environment configuration from "volca.config.ts" for stage ${stage}. The environment does not exist or is not deployable.`
  );
}

const { aws, domain, fromEmail } = config.environments[stage] as DeployableEnvironmentConfig;
const { name, github } = config;

const accountBootstrapStack = new AccountBootstrapStack(app, `${name}-account-bootstrap-stack`, {
  env: aws,
});

const vpcStack = new VpcStack(app, `${name}-${stage}-vpc-stack`, {
  service: name,
  stage,
  env: aws,
  strategy: aws.stackStrategy,
});

Tags.of(vpcStack).add('service', name);
Tags.of(vpcStack).add('stage', stage);

let hostedZone: IHostedZone | null = null;
if (domain) {
  const routingStack = new RoutingStack(app, `${name}-${stage}-routing-stack`, {
    service: name,
    stage,
    domain,
    env: aws,
    email: fromEmail,
  });

  hostedZone = routingStack.hostedZone;

  Tags.of(routingStack).add('service', name);
  Tags.of(routingStack).add('stage', stage);
}

const apiStack = new ApiStack(app, `${name}-${stage}-api-stack`, {
  service: name,
  stage,
  env: aws,
  strategy: aws.stackStrategy,
  vpc: vpcStack.vpc,
  hostedZone,
});

Tags.of(apiStack).add('service', name);
Tags.of(apiStack).add('stage', stage);

const webappStack = new WebappStack(app, `${name}-${stage}-webapp-stack`, {
  service: name,
  stage,
  env: aws,
  hostedZone,
});

Tags.of(webappStack).add('service', name);
Tags.of(webappStack).add('stage', stage);

const devopsStack = new DevopsStack(app, `${name}-${stage}-devops-stack`, {
  oidcProvider: accountBootstrapStack.provider,
  webappBucket: webappStack.bucket,
  cloudfrontDistribution: webappStack.distribution,
  service: name,
  stage,
  githubOrg: github.organization,
  githubRepo: github.repository,
  env: aws,
});

Tags.of(devopsStack).add('service', name);
Tags.of(devopsStack).add('stage', stage);
