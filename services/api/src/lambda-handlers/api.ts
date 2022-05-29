import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import serverless from 'serverless-http';

import { createServer } from '../server';

const server = createServer();
const serverlessHandler = serverless(server);

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return serverlessHandler(event, context);
};
