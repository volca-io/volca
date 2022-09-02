# Infrastructure

## Deploy a new stage

### With custom domain

To deploy a stage with a custom domain, you first have to create a hosted zone and point your domain to it's name servers. This is due to certificates being automatically created and validated for your domain by adding DNS records to the hosted zone. If the zone is not reachable, the certificates can't be validated and the deployment will fail.

#### Add the custom domain to volca config

First, add the custom domain to the stages configuration in `volca.config.ts`. Like this:

```ts
export const config: VolcaConfig = {
  name: 'volca',
  environments: {
    staging: {
      domain: 'staging.volca.io',
      aws: {
        account: '123456789000',
        region: 'eu-central-1',
        stackStrategy: StackStrategy.COST,
      },
    },
  },
};
```

#### Deploy the routing stack

To deploy the routing stack, replace the values in the command and execute it.

```sh
yarn infra:deploy -s <stage> --stacks <service-name>-<stage>-routing-stack
```

#### Point your domain to the hosted zones name servers

After the stack is completed, you will get a list of nameservers as an output. For example:

```
Outputs:
volca-sandbox-routing-stack.ExportsOutputRefHostedZone = Z1037258BDSKJWOZ6R2D
volca-sandbox-routing-stack.NameServers = ns-1126.awsdns-12.org, ns-642.awsdns-16.net, ns-220.awsdns-27.com, ns-1943.awsdns-50.co.uk
```

Take the list of name servers and add them to your domain registration as NS records. For example:

| Hostname         | Type | Data                    |
| ---------------- | ---- | ----------------------- |
| staging.volca.io | NS   | ns-1126.awsdns-12.org   |
|                  |      | ns-642.awsdns-16.net    |
|                  |      | ns-220.awsdns-27.com    |
|                  |      | ns-1943.awsdns-50.co.uk |

#### Make a full deployment

Once the DNS change has propagated, you can make a full deployment. Make sure to give the DNS changes some time to propagate.

```sh
yarn infra:deploy -s <stage>
```

## Without custom domain

If you don't have a domain, you can stil deploy the solution. You will then have to use the automatically generated domains from CloudFront and API-Gateway.

1. Make sure no domain is configured in `volca.config.ts`
2. Then run the following command

```sh
yarn infra:deploy -s <stage>
```
