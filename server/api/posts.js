import Router from 'koa-router';
import PostController from '../controllers/post';

const router = new Router({ prefix: '/api' });

router
  .get('/posts', PostController.getPosts)
  .get('/posts/:slug', PostController.getPost)
  .post('/posts', PostController.addPost)
  .delete('/posts/:slug', PostController.deletePost);

export default router;
