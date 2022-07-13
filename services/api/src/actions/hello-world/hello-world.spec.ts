import chai from 'chai';
import request from 'supertest';
import { Server } from 'http';

import { createServer } from '../../server';

const expect = chai.expect;

describe('Hello world', function () {
  let server: Server;

  beforeAll(function () {
    server = createServer().listen();
  });

  afterAll(function () {
    server.close();
  });

  it('get /hello-world returns message', async function () {
    const res = await request(server).get('/hello-world');
    expect(res.statusCode).to.eql(200);
    expect(res.body).to.eql({ message: 'Hello world!' });
  });
});
