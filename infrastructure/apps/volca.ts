#!/usr/bin/env node
import { App, Tags } from 'aws-cdk-lib';
import { Environment } from '../../config/types';
import { config } from '../../app.config';
import { CoreStack } from '../stacks/core-stack';
import { ApiStack } from '../stacks/api-stack';
import { WebappStack } from '../stacks/webapp-stack';
import { CertificateStack } from '../stacks/certificate-stack';

const app = new App();

const environment = app.node.tryGetContext('environment') as Environment;
const { name, github, aws, domain, fromEmail } = config;

const accountBootstrapStack = new CoreStack(app, `${name}-core-stack`, {
  env: aws,
  name,
  domain,
  email: fromEmail,
  githubOrg: github.organization,
  githubRepo: github.repository,
  crossRegionReferences: true,
});

if (environment) {
  // Certificates used by CloudFront needs to be in the us-east-1 region. These certificates are placed in
  // a separate stack in us-east-1 with crossRegionReferences enabled.
  const certificateStack = new CertificateStack(app, `${name}-${environment}-certificate-stack`, {
    hostedZone: accountBootstrapStack.hostedZone,
    subdomain: environment,
    env: {
      ...aws,
      region: 'us-east-1',
    },
    crossRegionReferences: true,
  });

  const apiStack = new ApiStack(app, `${name}-${environment}-api-stack`, {
    name,
    environment,
    env: aws,
    hostedZone: accountBootstrapStack.hostedZone,
    fromEmail,
    cognitoCertificate: certificateStack.cognitoCertificate,
    crossRegionReferences: true,
  });

  Tags.of(apiStack).add('name', name);
  Tags.of(apiStack).add('environment', environment);

  const webappStack = new WebappStack(app, `${name}-${environment}-webapp-stack`, {
    name,
    environment,
    env: aws,
    hostedZone: accountBootstrapStack.hostedZone,
    webappCertificate: certificateStack.webappCertificate,
    crossRegionReferences: true,
  });

  Tags.of(webappStack).add('name', name);
  Tags.of(webappStack).add('environment', environment);
}
