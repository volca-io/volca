import 'reflect-metadata';
import chai from 'chai';
import request from 'supertest';
import { Server } from 'http';

import { createServer } from '../../server';

const expect = chai.expect;

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
    expect(res.statusCode).to.eql(200);
    expect(res.body).to.eql({ status: 'OK' });
  });
});
