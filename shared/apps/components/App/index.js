import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';

import styles from './app.styles.less';

class App extends PureComponent {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.menu}>
          <ul className={styles['menu-wrapper']}>
            <li><Link to="/" href="/">Home</Link></li>
            <li><Link to="/blog" href="/blog">Blog</Link></li>
            <li><Link to="/about" href="/about">About</Link></li>
            <li><Link to="/contacts" href="/contacts">Contacts</Link></li>
          </ul>
        </div>
        <div className={styles.content}>
          {renderRoutes(this.props.route.routes)}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.array,
  }).isRequired,
};

export default App;
