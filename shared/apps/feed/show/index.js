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

  content() {
    return (
      this.props.feed.isLoading
        ? (
          <div className={styles.loading}>Loading Post</div>
        )
        : (
          <Post
            key={this.props.feed.currentPost.id}
            {...this.props.feed.currentPost}
            onDelete={this.handleDeletePost}
          />
        )
    );
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <Helmet
          title={this.props.feed.currentPost.title || 'Blog'}
        />
        {this.content()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  feed: state.post,
});

PostView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  feed: PropTypes.shape({
    currentPost: PropTypes.object,
    posts: PropTypes.array,
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

export default connect(mapStateToProps)(PostView);
