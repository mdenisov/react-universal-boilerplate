const request = require('supertest'); // eslint-disable-line
const api = require('../../../api');
const Server = require('../../../server');

const config = {
  env: 'test',
  api,
  renderer: (ctx) => {
    ctx.status = 200;
    ctx.body = { ok: 'ok' };
  },
};
const server = new Server(config);

describe('Post APIs', () => {
  test('Should load a post by slug', async () => {
    const response = await request(server.server).post('/api/v1/posts/get').send({ slug: 'hello-2' });

    expect(response.statusCode).toBe(200);
  }, 5000);

  test('Should load all posts', async () => {
    const response = await request(server.server).get('/api/v1/posts/list');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toEqual(5);
  }, 5000);

  test('Should add a new post', async () => {
    const postObj = {
      post: {
        name: 'Kashish',
        title: 'All cattos meow',
        content: 'All doggos woof',
      },
    };

    const response = await request(server.server).post('/api/v1/posts/create').send(postObj);

    expect(response.statusCode).toBe(201);
  }, 5000);

  test('Should delete post by slug', async () => {
    const response = await request(server.server).post('/api/v1/posts/remove').send({ slug: 'hello-2' });

    expect(response.statusCode).toBe(204);
  }, 5000);
});
