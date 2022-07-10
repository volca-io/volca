import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import serverless from 'serverless-http';
import { initialize } from 'src/lib/db/knex';

import { createServer } from '../server';

initialize({
  client: 'postgres',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
});

const server = createServer();
const serverlessHandler = serverless(server);

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return serverlessHandler(event, context);
};
