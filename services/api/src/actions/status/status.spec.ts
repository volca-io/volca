import 'reflect-metadata';
import request from 'supertest';
import { Server } from 'http';

import { createServer } from '../../server';

describe('Status', () => {
  let server: Server;

  beforeAll(() => {
    server = createServer().listen();
  });

  afterAll(() => {
    server?.close();
  });

  it('get /status returns OK', async () => {
    const res = await request(server).get('/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ status: 'OK' });
  });
});
