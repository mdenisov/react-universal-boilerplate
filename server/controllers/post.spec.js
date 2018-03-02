const request = require('supertest');
const app = require('../../server/server');

const inst = app.listen();

describe('Post APIs', () => {
  test('Should load a post by slug', async () => {
    const response = await request(inst).get('/api/posts/hello-2');
    expect(response.statusCode).toBe(200);
  }, 5000);

  test('Should load all posts', async () => {
    const response = await request(inst).get('/api/posts');
    expect(response.statusCode).toBe(200);
    expect(response.body.posts.length).toEqual(5);
  }, 5000);

  test('Should add a new post', async () => {
    const postObj = {
      post: {
        name: 'Kashish',
        title: 'All cattos meow',
        content: 'All doggos woof',
      },
    };

    const response = await request(inst).post('/api/posts').send(postObj);
    expect(response.statusCode).toBe(201);
  }, 5000);

  test('Should delete post by slug', async () => {
    const response = await request(inst).delete('/api/posts/hello-2');
    expect(response.statusCode).toBe(200);
  }, 5000);
});
