/* eslint-disable @typescript-eslint/no-unused-vars */
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import serverless from 'serverless-http';
import { Knex } from 'knex';
import Koa from 'koa';
import { createServer } from '../server';
import { loadEnvironmentVariables } from '../utils/environment';

let serverRef: Koa;
let databaseRef: Knex;

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  await loadEnvironmentVariables();

  context.callbackWaitsForEmptyEventLoop = false;

  if (!databaseRef || serverRef) {
    const { database, server } = await createServer();
    serverRef = server;
    databaseRef = database;
  }

  const serverlessHandler = serverless(serverRef);
  return serverlessHandler(event, context);
};
