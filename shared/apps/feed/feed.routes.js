import Feed from './index/index';
import PostView from './show/index';

import { fetchPostsIfNeeded, fetchSinglePostIfNeeded } from './feed.module';

const routes = [
  {
    path: '/blog',
    exact: true,
    component: Feed,
    loadData: () => [fetchPostsIfNeeded()],
  },
  {
    path: '/blog/:slug',
    component: PostView,
    loadData: ({ params }) => [fetchSinglePostIfNeeded(params)],
  },
];

export default routes;
