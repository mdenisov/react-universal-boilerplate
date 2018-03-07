import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import styles from './error.styles.css';

const Error = ({ staticContext }) => {
  // We have to check if staticContext exists
  // because it will be undefined if rendered through a BrowserRoute
  if (staticContext) staticContext.status = '404'; // eslint-disable-line no-param-reassign

  return (
    <div className={styles.card}>
      <Helmet title="Oops" />
      <p className={styles.title}>Oops, Page was not found!</p>
    </div>
  );
};

Error.defaultProps = {
  staticContext: {},
};

Error.propTypes = {
  staticContext: PropTypes.object, // eslint-disable-line
};

export default Error;
