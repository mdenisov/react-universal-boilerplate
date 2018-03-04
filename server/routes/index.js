import posts from './posts';

export default (app) => {
  app
    .use(posts.routes())
    .use(posts.allowedMethods());
};
