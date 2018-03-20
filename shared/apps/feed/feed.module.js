import { createAction, handleActions } from 'redux-actions';

import ApiClient from '../../../shared/utils/ApiClient';

const module = 'feed';

export const postsLoad = createAction(`${module}/posts/load`);
export const postsLoadSuccess = createAction(`${module}/posts/load/success`, data => ({ data }));
export const postsLoadFailure = createAction(`${module}/posts/load/failure`, error => ({ error }));

export const postLoad = createAction(`${module}/post/load`);
export const postLoadSuccess = createAction(`${module}/post/load/success`, data => ({ data }));
export const postLoadFailure = createAction(`${module}/post/load/failure`, error => ({ error }));

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
  [postsLoad]: state => ({
    ...state,
    posts: {
      loading: true,
      error: false,
      data: [],
    },
  }),

  [postsLoadSuccess]: (state, { payload: { data } }) => ({
    ...state,
    posts: {
      loading: false,
      error: false,
      data: [...data],
    },
  }),

  [postsLoadFailure]: (state, { payload: { error } }) => ({
    ...state,
    posts: {
      loading: false,
      data: [],
      error,
    },
  }),

  // Single
  [postLoad]: state => ({
    ...state,
    post: {
      loading: true,
      error: false,
      data: {},
    },
  }),

  [postLoadSuccess]: (state, { payload: { data } }) => ({
    ...state,
    post: {
      loading: false,
      error: false,
      data: { ...data },
    },
  }),

  [postLoadFailure]: (state, { payload: { error } }) => ({
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
export function fetchAllPosts() {
  return async (dispatch) => {
    dispatch(postsLoad());

    return ApiClient('/v1/posts/list', 'post')
      .then(res => dispatch(postsLoadSuccess(res)))
      .catch(res => dispatch(postsLoadFailure(res)));
  };
}

export function fetchAllPostsIfNeeded() {
  return (dispatch, getState) => {
    const { posts = {} } = getState().feed;

    if (posts.data.length === 0 && !posts.error) {
      return dispatch(fetchAllPosts());
    }

    return null;
  };
}

/**
 * Fetch Single Post
 */

export function fetchSinglePost(slug) {
  return async (dispatch) => {
    dispatch(postLoad());

    return ApiClient('/v1/posts/get', 'post', {
      slug,
    })
      .then(res => dispatch(postLoadSuccess(res)))
      .catch(res => dispatch(postLoadFailure(res)));
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

    return ApiClient('/v1/posts/remove', 'post', {
      slug,
    }).catch(err => console.log(err));
  };
}

/**
 * Create a Post
 */

export function createPost(title, content) {
  return (dispatch) => {
    const name = 'Admin';

    return ApiClient('/v1/posts/create', 'post', {
      post: {
        title,
        content,
        name,
      },
    })
      .then(res => dispatch(postCreate(res)))
      .catch(err => console.log(err));
  };
}

export default reducer;
