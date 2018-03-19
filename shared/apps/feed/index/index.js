import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import * as actions from '../feed.module';
import Post from '../components/Post/index';

import styles from '../feed.styles.css';

class Feed extends PureComponent {
  constructor() {
    super();

    this.state = {
      content: '',
      title: '',
    };

    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(actions.fetchAllPostsIfNeeded());
  }

  handleDeletePost(slug) {
    this.props.dispatch(actions.deletePost(slug));
  }

  handleInput(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  handleCreatePost() {
    const { title, content } = this.state;
    this.props.dispatch(actions.createPost(title, content));

    this.setState({
      title: '',
      content: '',
    });
  }

  renderError() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>{this.props.posts.error.message}</div>
      </div>
    );
  }

  renderContent() {
    return (
      this.props.posts.loading
        ? (
          <div className={styles.loading}>Loading Post</div>
        )
        : (
          this.props.posts.data.map(post => (
            <Post
              key={post.id}
              {...post}
              onDelete={this.handleDeletePost}
            />
          ))
        )
    );
  }

  render() {
    return (
      <div>
        <Helmet title="Blog" />
        {
          this.props.posts.error
            ? this.renderError()
            : this.renderContent()
        }
        <div className={styles.form}>
          <input
            type="text"
            value={this.state.title}
            name="title"
            placeholder="Enter Title"
            onChange={this.handleInput}
          />
          <textarea
            value={this.state.content}
            name="content"
            placeholder="Enter post"
            onChange={this.handleInput}
          />
          <button onClick={this.handleCreatePost}>
            Create Post
          </button>
        </div>
      </div>
    );
  }
}

// Actions required to provide data for this component to render in server side.
// Feed.prefetch = [() => { return actions.fetchAllPosts(); }];

const mapStateToProps = state => ({
  posts: state.post.posts,
});

Feed.propTypes = {
  dispatch: PropTypes.func.isRequired,
  posts: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
    data: PropTypes.array,
  }).isRequired,
};

export default connect(mapStateToProps)(Feed);
