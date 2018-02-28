const Router = require('koa-router');
const PostController = require('../controllers/post');

const router = new Router({ prefix: '/api' });

// Get all Posts
router.get('/posts', PostController.getPosts);

// Get one post by slug
router.get('/posts/:slug', PostController.getPost);

// Add a new Post
router.post('/posts', PostController.addPost);

// Delete a post by slug
router.delete('/posts/:slug', PostController.deletePost);

module.exports = router;
