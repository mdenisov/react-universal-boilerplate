import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import * as actions from '../feed.module';
import Post from '../components/Post/index';

import styles from '../feed.styles.css';

class PostView extends PureComponent {
  constructor() {
    super();

    this.handleDeletePost = this.handleDeletePost.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(actions.fetchSinglePostIfNeeded(this.props.match.params));
  }

  handleDeletePost(slug) {
    this.props.dispatch(actions.deletePost(slug));
  }

  renderError() { // eslint-disable-line
    return (
      <div className={styles.loading}>{this.props.post.error}</div>
    );
  }

  renderContent() {
    return (
      this.props.post.loading
        ? (
          <div className={styles.loading}>Loading Post</div>
        )
        : (
          <Post
            key={this.props.post.data.id}
            {...this.props.post.data}
            onDelete={this.handleDeletePost}
          />
        )
    );
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <Helmet
          title={this.props.post.data.title || 'Blog'}
        />
        {
          this.props.post.error
            ? this.renderError()
            : this.renderContent()
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  post: state.post.post,
});

PostView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  post: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    data: PropTypes.object,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

export default connect(mapStateToProps)(PostView);
