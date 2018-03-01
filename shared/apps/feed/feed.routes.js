import Feed from './index/index';
import PostView from './show/index';

import { fetchAllPostsIfNeeded, fetchSinglePostIfNeeded } from './feed.module';

const routes = [
  {
    path: '/blog',
    exact: true,
    component: Feed,
    loadData: () => [fetchAllPostsIfNeeded()],
  },
  {
    path: '/blog/:slug',
    component: PostView,
    loadData: ({ params }) => [fetchSinglePostIfNeeded(params)],
  },
];

export default routes;
