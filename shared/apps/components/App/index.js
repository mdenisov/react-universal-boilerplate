import React, { PureComponent } from 'react';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';

import styles from './app.styles.less';

class App extends PureComponent {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.menu}>
          <ul className={styles.wrapper}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>
        <div className={styles.content}>
          {renderRoutes(this.props.route.routes)}
        </div>
        <div className={styles.footer}>
          <ul className={styles.wrapper}>
            <li><Link to="/" href="/">Home</Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
