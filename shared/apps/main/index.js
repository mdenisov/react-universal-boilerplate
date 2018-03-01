import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { NavLink } from 'react-router-dom';

import styles from './app.styles.less';

class Main extends PureComponent {
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
  route: PropTypes.shape({
    routes: PropTypes.array,
  }).isRequired,
};

export default Main;
