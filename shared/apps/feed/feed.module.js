import 'isomorphic-fetch';

const module = 'feed';

export const POSTS_LOAD = `${module}/posts/load`;
export const POSTS_LOAD_SUCCESS = `${module}/posts/load/success`;
export const POSTS_LOAD_FAILURE = `${module}/posts/load/failure`;

export const POST_LOAD = `${module}/post/load`;
export const POST_LOAD_SUCCESS = `${module}/post/load/success`;
export const POST_LOAD_FAILURE = `${module}/post/load/failure`;

export const POST_REMOVE = `${module}/post/remove`;
export const POST_ADD = `${module}/post/add`;

const DEFAULT_OPTIONS = {
  // credentials: 'include',
  // mode: 'cors',
  cache: 'default',
  headers: {
    'Content-Type': 'application/json',
  },
};

/*
 * ACTIONS
 */

// Fetch All Posts

function fetchAllPostsRequest() {
  return {
    type: POSTS_LOAD,
  };
}

function fetchAllPostsSuccess(response) {
  return {
    type: POSTS_LOAD_SUCCESS,
    posts: response.posts,
  };
}

function fetchAllPostsFailure(error) {
  return {
    type: POSTS_LOAD_FAILURE,
    error,
  };
}

export function fetchAllPosts() {
  return async (dispatch, getState) => {
    dispatch(fetchAllPostsRequest());

    const url = 'http://localhost:8000/api/posts';

    try {
      const res = await fetch(url, { ...DEFAULT_OPTIONS })
        .then(response => response.json());

      dispatch(fetchAllPostsSuccess(res));
    } catch (err) {
      dispatch(fetchAllPostsFailure(err.message));
    }
  };
}

export function fetchAllPostsIfNeeded() {
  return (dispatch, getState) => {
    if (getState().post.posts.length === 0) {
      return dispatch(fetchAllPosts());
    }

    return null;
  };
}

// Fetch Single Post

function fetchSinglePostRequest() {
  return {
    type: POST_LOAD,
  };
}

function fetchSinglePostSuccess(response) {
  return {
    type: POST_LOAD_SUCCESS,
    post: response.post,
  };
}

function fetchSinglePostFailure(error) {
  return {
    type: POST_LOAD_FAILURE,
    error,
  };
}

export function fetchSinglePost(slug) {
  return async (dispatch) => {
    dispatch(fetchSinglePostRequest());

    const url = `http://localhost:8000/api/posts/${slug}`;

    try {
      const res = await fetch(url, { ...DEFAULT_OPTIONS })
        .then(response => response.json());

      dispatch(fetchSinglePostSuccess(res));
    } catch (err) {
      dispatch(fetchSinglePostFailure(err.message));
    }
  };
}

export function fetchSinglePostIfNeeded(params) {
  return (dispatch, getState) => {
    const post = getState().post.currentPost;

    if (!post || post.slug !== params.slug) {
      return dispatch(fetchSinglePost(params.slug));
    }

    return null;
  };
}

// Delete a Post

function removePost(slug) {
  return { type: POST_REMOVE, slug };
}

export function deletePost(slug) {
  return (dispatch) => {
    dispatch(removePost(slug));

    fetch(`/api/posts/${slug}`, {
      ...DEFAULT_OPTIONS,
      method: 'delete',
    })
      .then(() => {})
      .catch(() => {});
  };
}

// Create a Post

function addPost(post) {
  return { type: POST_ADD, post };
}

export function createPost(title, content) {
  return (dispatch) => {
    fetch('/api/posts', {
      ...DEFAULT_OPTIONS,
      method: 'post',
      body: JSON.stringify({
        post: {
          title,
          content,
          name: 'Admin',
        },
      }),
    })
      .then(response => response.json())
      .then((response) => { dispatch(addPost(response.post)); })
      .catch(() => {});
  };
}

/*
 * REDUCER
 */

const defaultState = {
  currentPost: {},
  posts: [],
  isLoading: false,
  isError: false,
};

// Reducer
export default function reducer(state = defaultState, action) {
  const { type } = action;
  let newState = state;

  switch (type) {
    case POSTS_LOAD: {
      newState = {
        ...state,
        isLoading: true,
        isError: false,
        currentPost: {},
      };

      break;
    }

    case POSTS_LOAD_SUCCESS: {
      newState = {
        ...state,
        isLoading: false,
        isError: false,
        posts: [...action.posts],
      };

      break;
    }

    case POSTS_LOAD_FAILURE: {
      newState = {
        ...state,
        isLoading: false,
        isError: true,
      };

      break;
    }

    case POST_LOAD: {
      newState = {
        ...state,
        isLoading: true,
        isError: false,
      };

      break;
    }

    case POST_LOAD_SUCCESS: {
      newState = {
        ...state,
        isLoading: false,
        isError: false,
        currentPost: {
          ...action.post,
        },
      };

      break;
    }

    case POST_LOAD_FAILURE: {
      newState = {
        ...state,
        isLoading: false,
        isError: true,
      };

      break;
    }

    case POST_REMOVE: {
      newState = {
        ...state,
        posts: state.posts.filter(post => post.slug !== action.slug),
      };

      break;
    }

    case POST_ADD: {
      newState = {
        ...state,
        posts: [action.post, ...state.posts],
      };

      break;
    }

    default: {
      newState = state;
    }
  }

  return newState;
}
