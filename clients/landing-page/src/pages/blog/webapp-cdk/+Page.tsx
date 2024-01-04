import { Container, Flex, Heading, Image, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { SectionHeader } from '../../../components/SectionHeader';
import { CodeBlock } from '../../../components/CodeBlock';
import header from './webapp-cdk-header.webp';

const Page = () => {
  return (
    <Container maxW="4xl" py={12}>
      <SectionHeader
        category="Blog"
        title="Web application hosting using AWS CDK and TypeScript"
        description="In this blog post we will go through how to host and serve a web application on AWS with the help of the Cloud Development Kit (CDK)  and services such as S3, CloudFront and Route53."
      />

      <Image src={header} alt="Blog post hero image" my={16} />

      <Flex flexDirection="column" gap={16} my={16}>
        <Flex flexDirection="column" gap={6}>
          <Heading as="h2">Overview</Heading>
          <Text>
            What we want to achieve with this tutorial is to host and serve a HTML based web application. For that, we
            will need the following resources:
          </Text>
          <UnorderedList>
            <ListItem>An S3 bucket for file hosting</ListItem>
            <ListItem>A CloudFront distribution for CDN</ListItem>
            <ListItem>A Route 53 managed hosted zone for our custom domain</ListItem>
            <ListItem>An ACM managed SSL certificate to enable HTTPS with our custom domain</ListItem>
          </UnorderedList>
          <Text>
            This article explains each resource that needs to be created and how they fit together. The full source code
            is <Link href="https://github.com/volca-io/webapp-cdk">available on GitHub.</Link>
          </Text>
        </Flex>

        <Flex flexDirection="column" gap={6}>
          <Heading as="h2">Defining the stack</Heading>
          <Text>Let's start with defining the stack that all of our resources will reside:</Text>
          <CodeBlock language="ts">
            {`import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface WebappStackProps extends StackProps {
  domain: string;
}

export class WebappStack extends Stack {

  constructor(scope: Construct, id: string, props: WebappStackProps) {
    super(scope, id, props);
  }
}`}
          </CodeBlock>
          <Text>
            This will create an empty stack. Next, let's define the resources we need to host a web application.
          </Text>
        </Flex>

        <Flex flexDirection="column" gap={6}>
          <Heading as="h2">Bucket and origin access identity</Heading>
          <Text>
            The below code creates a bucket that will hold the HTML and asset files that make up the web application.
          </Text>
          <CodeBlock language="ts">
            {`const bucket = new Bucket(this, 'WebappHostingBucket', {
  websiteIndexDocument: 'index.html',
  websiteErrorDocument: 'index.html',
  blockPublicAccess: new BlockPublicAccess({ restrictPublicBuckets: false }),
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});`}
          </CodeBlock>
          <Text>
            The below code creates an origin access identity (OAI) that allows the CloudFront CDN to access the S3
            bucket and serve the files inside it.
          </Text>
          <CodeBlock language="ts">
            {`const oai = new OriginAccessIdentity(this, 'WebappCloudFrontOriginAccessIdentity');
bucket.grantRead(oai.grantPrincipal);`}
          </CodeBlock>
        </Flex>

        <Flex flexDirection="column" gap={6}>
          <Heading as="h2">Hosted zone and certificate</Heading>
          <Text>
            The below code creates a hosted zone that holds the domain that we want to use for our web application
          </Text>
          <CodeBlock language="ts">
            {`const hostedZone = new HostedZone(this, 'HostedZone', { zoneName: props.domain });`}
          </CodeBlock>
          <Text>
            Let's add the Route 53 name servers for our domain as outputs to the stack. Once the stack is deployed, you
            need to point your domain to these name servers.
          </Text>
          <CodeBlock language="ts">
            {`if (hostedZone.hostedZoneNameServers) {
  new CfnOutput(this, 'NameServers', { value: Fn.join(', ', hostedZone.hostedZoneNameServers) });
}`}
          </CodeBlock>
          <Text>
            Next, let's create an ACM managed certificate that allows us to enable HTTPS for the web application
          </Text>
          <CodeBlock language="ts">
            {`const certificate: DnsValidatedCertificate | null = new DnsValidatedCertificate(this, 'Certificate', {
  domainName: props.domain,
  subjectAlternativeNames: [props.domain, \`www.\${props.domain}\`],
  validation: CertificateValidation.fromDns(hostedZone),
  region: 'us-east-1',
  hostedZone: hostedZone,
  cleanupRoute53Records: true,
});`}
          </CodeBlock>
        </Flex>

        <Flex flexDirection="column" gap={6}>
          <Heading as="h2">CloudFront distribution (CDN)</Heading>
          <Text>
            The below code creates a CloudFront distribution that acts as a CDN for our web application. The CloudFront
            distribution points to our S3 bucket as an origin and uses our ACM certificate.
          </Text>
          <CodeBlock language="ts">
            {`const distribution = new CloudFrontWebDistribution(this, 'WebappDistribution', {
    viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
      aliases: [props.domain, \`www.\${props.domain}\`],
      securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2021,
      sslMethod: SSLMethod.SNI,
    }),
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity: oai,
        },
        behaviors: [{ isDefaultBehavior: true }],
      },
    ],
    errorConfigurations: [
      {
        errorCode: 404,
        errorCachingMinTtl: 300,
        responseCode: 200,
        responsePagePath: '/index.html',
      },
    ],
  });

  bucket.grantRead(oai.grantPrincipal);`}
          </CodeBlock>
        </Flex>

        <Flex flexDirection="column" gap={6}>
          <Heading as="h2">A-record</Heading>
          <Text>
            Finally, an A-record is created in our hosted zone that points the domain to the CloudFront distribution
            that serves our web application
          </Text>
          <CodeBlock language="ts">
            {`new ARecord(this, 'WebappARecord', {
    target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    zone: hostedZone,
    recordName: \`\${props.domain}\`,
  });`}
          </CodeBlock>
          <Text>Now we have defined all of the resources required to host our web application!</Text>
        </Flex>

        <Flex flexDirection="column" gap={6}>
          <Heading as="h2">Deploy</Heading>
          <Text>Follow the below steps to deploy the stack:</Text>
          <UnorderedList>
            <ListItem>Run yarn</ListItem>
            <ListItem>Add your configuration to config.json - leave nsConfigured as false</ListItem>
            <ListItem>Run yarn deploy</ListItem>
            <ListItem>
              Configure the name servers of your domain with the name servers in the stack output from the AWS console
            </ListItem>
            <ListItem>Wait for the change to propagate</ListItem>
            <ListItem>Update config.json with "nsConfigured": true</ListItem>
            <ListItem>Run yarn deploy</ListItem>
            <ListItem>Done! 🎉</ListItem>
          </UnorderedList>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Page;
