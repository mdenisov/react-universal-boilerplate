import Main from './apps/main/index';
import HomeRoutes from './apps/home/home.routes';
import FeedRoutes from './apps/feed/feed.routes';
import AboutRoutes from './apps/about/about.routes';
import ContactsRoutes from './apps/contacts/contacts.routes';
import NotFound from './apps/error/404';

const routes = [
  {
    component: Main,
    routes: [
      ...HomeRoutes,
      ...AboutRoutes,
      ...ContactsRoutes,
      ...FeedRoutes,

      { component: NotFound },
    ],
  },
];

export default routes;
