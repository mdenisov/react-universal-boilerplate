import App from './apps/components/App';
import FeedRoutes from './apps/feed/feed.routes';

const routes = [
  {
    path: '/',
    component: App,
    routes: [
      ...FeedRoutes,
    ],
  },
];

export default routes;
