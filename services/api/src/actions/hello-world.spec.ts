import chai from 'chai';
import request from 'supertest';
import Koa from 'koa';

import { createServer } from '../server';

const expect = chai.expect;

describe('Hello world', function () {
  let server: Koa;

  before(function () {
    server = createServer();
  });

  it('get /hello-world returns message', async function () {
    const res = await request(server.listen()).get('/hello-world');
    expect(res.statusCode).to.eql(200);
    expect(res.body).to.eql({ message: 'Hello world!' });
  });
});
