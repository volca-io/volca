import { Server } from 'http';
import { Knex } from 'knex';
import supertest, { SuperTest, Test } from 'supertest';
import { createServer } from '../server';

export function setupServer() {
  let databaseRef: Knex;
  let serverRef: Server;
  let request: SuperTest<Test>;

  beforeAll(async () => {
    const { server, database } = await createServer();
    serverRef = server.listen();
    databaseRef = database;
    request = supertest(serverRef);
  });

  afterAll((done) => {
    databaseRef.destroy().then(() => {
      serverRef.close(() => {
        done();
      });
    });
  });

  return () => request;
}
