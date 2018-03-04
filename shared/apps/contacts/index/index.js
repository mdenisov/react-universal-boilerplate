import React from 'react';
import Helmet from 'react-helmet';

import styles from '../contacts.styles.css';

const Contacts = () => (
  <div className={styles.card}>
    <Helmet title="Contacts" />
    <h1>Contacts</h1>
    <div className={styles.description}>
      React Helmet is a library that allows managing document meta from your
      React components easily. It works on the client side as well as on the server.
      Well need to make a few edits to our files, but lets install it first
    </div>
  </div>
);

export default Contacts;
