const request = require('supertest'); // eslint-disable-line
const Server = require('./server');

const config = {
  env: 'test',
  renderer: (ctx) => {
    ctx.status = 200;
    ctx.body = { ok: 'ok' };
  },
};

describe('Server', () => {
  test('Returns self', async () => {
    const server = new Server(config);

    expect(server instanceof Server).toBe(true);
  }, 5000);

  test('Main route', async () => {
    const server = new Server(config);
    const res = await request(server.server).get('/');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe('ok');
  }, 5000);
});
