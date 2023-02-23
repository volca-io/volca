/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import serverless from 'serverless-http';

import { createServer } from '../server';


// We need to keep a reference to the database connection outside the lambda handler to
// not create a new connection on each request
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { app, database } = createServer();
const serverlessHandler = serverless(app);

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return serverlessHandler(event, context);
};
