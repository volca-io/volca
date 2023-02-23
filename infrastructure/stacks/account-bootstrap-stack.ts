import { Stack, StackProps } from 'aws-cdk-lib';
import { OpenIdConnectProvider } from 'aws-cdk-lib/aws-iam';

import { Construct } from 'constructs';

export class AccountBootstrapStack extends Stack {
  public provider: OpenIdConnectProvider;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.provider = new OpenIdConnectProvider(this, 'GithubOidcProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    });
  }
}
