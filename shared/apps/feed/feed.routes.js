import Feed from './index/index';
import PostView from './show/index';

import { fetchAllPostsIfNeeded, fetchSinglePostIfNeeded } from './feed.module';

const routes = [
  {
    path: '/',
    exact: true,
    component: Feed,
    loadData: ({ params, getState }) => [fetchAllPostsIfNeeded()],
  },
  {
    path: '/:slug',
    component: PostView,
    loadData: ({ params, getState }) => [fetchSinglePostIfNeeded(params)],
  },
];

export default routes;
