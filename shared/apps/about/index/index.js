import React from 'react';

import styles from '../about.styles.less';

const About = () => (
  <div className={styles.card}>
    <h1>About</h1>
    <div className={styles.description}>
      We also need to edit our server.jsx file and call Helmet.renderStatic() after
      ReactDOMServer.renderToString to be able to use the head data in our prerender.
    </div>
  </div>
);

export default About;
