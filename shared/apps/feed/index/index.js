import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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

  content() {
    return (
      this.props.feed.isLoading
        ? (
          <p>Loading posts</p>
        )
        : (
          this.props.feed.posts.map(post => (
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
        <div>
          { this.content() }
        </div>
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
  feed: state.post,
});

Feed.propTypes = {
  dispatch: PropTypes.func.isRequired,
  feed: PropTypes.shape({
    currentPost: PropTypes.object,
    posts: PropTypes.array,
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
  }).isRequired,
};

export default connect(mapStateToProps)(Feed);
