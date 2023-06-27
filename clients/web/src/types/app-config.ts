export type AppConfig = {
  stripeTestCardEnabled: boolean;
  aws_region: string;
  awsCognitoLoginDomain?: string;
  awsCognitoUserpoolId?: string;
  awsCognitoAppClientId?: string;
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
