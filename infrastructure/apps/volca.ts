#!/usr/bin/env node
import { App, Tags, SecretValue } from 'aws-cdk-lib';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Environment } from '../../config/types';
import { config } from '../../app.config';
import { AccountBootstrapStack } from '../stacks/account-bootstrap-stack';
import { ApiStack } from '../stacks/api-stack';
import { DevopsStack } from '../stacks/devops-stack';
import { RoutingStack } from '../stacks/routing-stack';
import { VpcStack } from '../stacks/vpc-stack';
import { WebappStack } from '../stacks/webapp-stack';

const app = new App();

const stage = app.node.tryGetContext('stage') as Environment;
const environmentConfig = config.environments[stage];

if (!environmentConfig.deploymentConfig) {
  throw new Error(
    `Failed to read environment configuration from "app.config.ts" for stage ${stage}. The environment does not exist or is not deployable.`
  );
}

const { aws, domain } = environmentConfig.deploymentConfig;
const { name, github } = config;
const { FROM_EMAIL: fromEmail, DB_USERNAME: dbUsername } = environmentConfig.environmentVariables;

const accountBootstrapStack = new AccountBootstrapStack(app, `${name}-account-bootstrap-stack`, {
  env: aws,
});

const vpcStack = new VpcStack(app, `${name}-${stage}-vpc-stack`, {
  service: name,
  stage,
  env: aws,
  publicDatabase: aws.publicDatabase,
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
  vpc: vpcStack.vpc,
  hostedZone,
  publicDatabase: aws.publicDatabase,
  dbUsername,
  dbPassword: SecretValue.ssmSecure(`/${name}/${stage}/DB_PASSWORD`),
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
