export type AppConfig = {
  awsRegion: string;
  awsCognitoLoginDomain?: string;
  awsCognitoUserpoolId?: string;
  awsCognitoIdentityPoolId?: string;
  awsCognitoAppClientId?: string;
  awsS3AssetsBucket?: string;
  stripeTestCardEnabled: boolean;
  identityProviders: {
    facebook: boolean;
    apple: boolean;
    google: boolean;
  };
  mockTokens?: {
    idToken: string;
    accessToken: string;
  };
};
