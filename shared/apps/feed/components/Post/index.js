import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './post.styles.css';

const Post = ({
  name, slug, title, content, onDelete,
}) => (
  <div className={styles.card}>
    <div className={styles.header}>
      <div className={styles.avatar}>
        <img className={styles.avatar__img} src="http://www.woueb.net/images/manga/romain-manga.jpg" alt={name} />
      </div>
      <div className={styles['user-info']}>{name}</div>
    </div>
    <Link to={`/${slug}`} href={`${slug}`} className={styles.title}>
      <h2>{title}</h2>
    </Link>

    <div className={styles.description} dangerouslySetInnerHTML={{ __html: content }} />

    <div className={styles.footer}>
      <div className={styles.footer__content}>
        <button onClick={() => onDelete(slug)}>Delete</button>
      </div>
    </div>
  </div>
);

Post.propTypes = {
  name: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};

export default Post;
