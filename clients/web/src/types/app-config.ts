export type AppConfig = {
  stripeTestCardEnabled: boolean;
  awsRegion: string;
  awsCognitoLoginDomain?: string;
  awsCognitoUserpoolId?: string;
  awsCognitoIdentityPoolId?: string;
  awsCognitoAppClientId?: string;
  awsS3AssetsBucket?: string;
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
