import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import { renderRoutes } from 'react-router-config';
import { NavLink } from 'react-router-dom';
import Helmet from 'react-helmet';

import styles from './app.styles.css';

class Main extends PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  renderNavigation() {
    return (
      <div className={styles['menu-wrapper']}>
        {
          this.constructor.navigation.map(item => (
            <NavLink
              key={item.name.toLowerCase()}
              className={styles['menu-item']}
              to={item.href}
              href={item.href}
              activeClassName={styles['menu-item--active']}
            >
              {item.name}
            </NavLink>
          ))
        }
      </div>
    );
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <Helmet
          title="Build something amazing!"
          titleTemplate="%s | Client"
          meta={[
            { charset: 'utf-8' },
            {
              'http-equiv': 'X-UA-Compatible',
              content: 'IE=edge',
            },
            {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1',
            },
          ]}
        />
        <div className={styles.menu}>
          { this.renderNavigation() }
        </div>
        <div className={styles.content}>
          {renderRoutes(this.props.route.routes)}
        </div>
      </div>
    );
  }
}

Main.navigation = [
  { href: '/', name: 'Home' },
  { href: '/blog', name: 'Blog' },
  { href: '/about', name: 'About' },
  { href: '/contacts', name: 'Contacts' },
];

Main.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  route: PropTypes.shape({
    routes: PropTypes.array,
  }).isRequired,
};

export default Main;
