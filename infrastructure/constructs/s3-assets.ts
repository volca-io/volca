import { RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, BlockPublicAccess, BucketEncryption, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import CognitoAuthRole from './cognito-auth-role';

interface S3AssetsProps {
  authenticatedRole: CognitoAuthRole;
  domain: string;
}

export class S3Assets extends Construct {
  public bucket: Bucket;

  constructor(scope: Construct, id: string, props: S3AssetsProps) {
    super(scope, id);

    const appDomain = `app.${props.domain}`;

    this.bucket = new Bucket(this, 'AssetsBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          maxAge: 3000,
          allowedOrigins: [`https://${appDomain}`, 'http://localhost:3000'],
          allowedHeaders: ['*'],
          allowedMethods: [HttpMethods.GET, HttpMethods.POST, HttpMethods.PUT, HttpMethods.DELETE],
          exposedHeaders: ['x-amz-server-side-encryption', 'x-amz-request-id', 'x-amz-id-2', 'ETag'],
        },
      ],
    });
    this.bucket.applyRemovalPolicy(RemovalPolicy.DESTROY);

    props.authenticatedRole.role.addToPolicy(
      new PolicyStatement({
        actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
        effect: Effect.ALLOW,
        resources: [
          this.bucket.bucketArn + '/public/*',
          this.bucket.bucketArn + '/protected/${cognito-identity.amazonaws.com:sub}/*',
          this.bucket.bucketArn + '/private/${cognito-identity.amazonaws.com:sub}/*',
        ],
      })
    );

    props.authenticatedRole.role.addToPolicy(
      new PolicyStatement({
        actions: ['s3:PutObject'],
        effect: Effect.ALLOW,
        resources: [this.bucket.bucketArn + '/uploads/*'],
      })
    );

    props.authenticatedRole.role.addToPolicy(
      new PolicyStatement({
        actions: ['s3:GetObject'],
        effect: Effect.ALLOW,
        resources: [this.bucket.bucketArn + '/protected/*'],
      })
    );

    props.authenticatedRole.role.addToPolicy(
      new PolicyStatement({
        actions: ['s3:ListBucket'],
        effect: Effect.ALLOW,
        resources: [this.bucket.bucketArn],
        conditions: {
          StringLike: {
            's3:prefix': [
              'public/',
              'public/*',
              'protected/',
              'protected/*',
              'private/${cognito-identity.amazonaws.com:sub}/',
              'private/${cognito-identity.amazonaws.com:sub}/*',
            ],
          },
        },
      })
    );
  }
}
