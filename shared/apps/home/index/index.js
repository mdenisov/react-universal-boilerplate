import React from 'react';
import Helmet from 'react-helmet';

import styles from '../home.styles.css';

const Home = () => (
  <div className={styles.card}>
    <Helmet title="Home" />
    <h1>Home</h1>
    <div className={styles.description}>
      <p>
        We also need to edit our server.jsx file and call Helmet.renderStatic() after
        ReactDOMServer.renderToString to be able to use the head data in our prerender.
      </p>
      <p>
        We also need to edit our server.jsx file and call Helmet.renderStatic() after
        ReactDOMServer.renderToString to be able to use the head data in our prerender.
      </p>
      <p>
        We also need to edit our server.jsx file and call Helmet.renderStatic() after
        ReactDOMServer.renderToString to be able to use the head data in our prerender.
      </p>
    </div>
  </div>
);

export default Home;
