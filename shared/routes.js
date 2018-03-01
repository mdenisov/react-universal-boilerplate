import App from './apps/components/App';
import FeedRoutes from './apps/feed/feed.routes';
import AboutRoutes from './apps/about/about.routes';
import ContactsRoutes from './apps/contacts/contacts.routes';

const routes = [
  {
    component: App,
    routes: [
      ...AboutRoutes,
      ...ContactsRoutes,
      ...FeedRoutes,
    ],
  },
];

export default routes;
