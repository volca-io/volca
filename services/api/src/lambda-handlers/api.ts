/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import serverless from 'serverless-http';

import { createServer } from '../server';
import { initialize } from '../lib/db/knex';

// @ts-ignore
const knex = initialize({
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
