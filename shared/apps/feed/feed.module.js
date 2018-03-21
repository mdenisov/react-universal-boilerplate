import { createAction, handleActions } from 'redux-actions';

import api from './feed.api';

const module = 'feed';

export const loadPosts = createAction(`${module}/posts/load`);
export const loadPostsSuccess = createAction(`${module}/posts/load/success`, data => ({ data }));
export const loadPostsFailure = createAction(`${module}/posts/load/failure`, error => ({ error }));

export const loadPost = createAction(`${module}/post/load`);
export const loadPostSuccess = createAction(`${module}/post/load/success`, data => ({ data }));
export const loadPostFailure = createAction(`${module}/post/load/failure`, error => ({ error }));

export const postRemove = createAction(`${module}/post/remove`, slug => ({ slug }));
export const postCreate = createAction(`${module}/post/create`, data => ({ data }));


const defaultState = {
  post: {
    loading: false,
    error: false,
    data: {},
  },
  posts: {
    loading: false,
    error: false,
    data: [],
  },
};

/**
 * REDUCER
 */

const reducer = handleActions({
  // List
  [loadPosts]: state => ({
    ...state,
    posts: {
      loading: true,
      error: false,
      data: [],
    },
  }),

  [loadPostsSuccess]: (state, { payload: { data } }) => ({
    ...state,
    posts: {
      loading: false,
      error: false,
      data: [...data],
    },
  }),

  [loadPostsFailure]: (state, { payload: { error } }) => ({
    ...state,
    posts: {
      loading: false,
      data: [],
      error,
    },
  }),

  // Single
  [loadPost]: state => ({
    ...state,
    post: {
      loading: true,
      error: false,
      data: {},
    },
  }),

  [loadPostSuccess]: (state, { payload: { data } }) => ({
    ...state,
    post: {
      loading: false,
      error: false,
      data: { ...data },
    },
  }),

  [loadPostFailure]: (state, { payload: { error } }) => ({
    ...state,
    post: {
      loading: false,
      data: {},
      error,
    },
  }),

  // Remove
  [postRemove]: (state, { payload: { slug } }) => ({
    ...state,
    posts: {
      loading: false,
      error: false,
      data: [...state.posts.data.filter(post => post.slug !== slug)],
    },
  }),

  // Create
  [postCreate]: (state, { payload: { data } }) => ({
    ...state,
    posts: {
      loading: false,
      error: false,
      data: [data, ...state.posts.data],
    },
  }),
}, defaultState);

/**
 * Fetch Posts
 */
export function fetchPosts() {
  return async (dispatch) => {
    dispatch(loadPosts());

    return api.fetchPosts()
      .then(res => dispatch(loadPostsSuccess(res)))
      .catch(res => dispatch(loadPostsFailure(res)));
  };
}

export function fetchPostsIfNeeded() {
  return (dispatch, getState) => {
    const { posts = {} } = getState().feed;

    if (posts.data.length === 0 && !posts.error) {
      return dispatch(fetchPosts());
    }

    return null;
  };
}

/**
 * Fetch Single Post
 */

export function fetchSinglePost(slug) {
  return async (dispatch) => {
    dispatch(loadPost());

    return api.fetchPost({
      data: {
        slug,
      },
    })
      .then(res => dispatch(loadPostSuccess(res)))
      .catch(res => dispatch(loadPostFailure(res)));
  };
}

export function fetchSinglePostIfNeeded(params) {
  return (dispatch, getState) => {
    const { post = {} } = getState().feed;

    if ((post.data.slug !== params.slug) && !post.error) {
      return dispatch(fetchSinglePost(params.slug));
    }

    return null;
  };
}

/**
 * Delete a Post
 */

export function deletePost(slug) {
  return (dispatch) => {
    dispatch(postRemove(slug));

    return api.removePosts({
      data: {
        slug,
      },
    }).catch(err => console.log(err));
  };
}

/**
 * Create a Post
 */

export function createPost(title, content) {
  return (dispatch) => {
    const name = 'Admin';

    return api.createPost({
      data: {
        post: {
          title,
          content,
          name,
        },
      },
    })
      .then(res => dispatch(postCreate(res)))
      .catch(err => console.log(err));
  };
}

export default reducer;
