import Main from './apps/main/index';
import FeedRoutes from './apps/feed/feed.routes';
import AboutRoutes from './apps/about/about.routes';
import ContactsRoutes from './apps/contacts/contacts.routes';

const routes = [
  {
    component: Main,
    routes: [
      ...AboutRoutes,
      ...ContactsRoutes,
      ...FeedRoutes,
    ],
  },
];

export default routes;
