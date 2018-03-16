import ApiClient from '../../../shared/utils/ApiClient';

const module = 'feed';

export const POSTS_LOAD = `${module}/posts/load`;
export const POSTS_LOAD_SUCCESS = `${module}/posts/load/success`;
export const POSTS_LOAD_FAILURE = `${module}/posts/load/failure`;

export const POST_LOAD = `${module}/post/load`;
export const POST_LOAD_SUCCESS = `${module}/post/load/success`;
export const POST_LOAD_FAILURE = `${module}/post/load/failure`;

export const POST_REMOVE = `${module}/post/remove`;
export const POST_ADD = `${module}/post/add`;


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
    data: response,
  };
}

function fetchAllPostsFailure(error) {
  return {
    type: POSTS_LOAD_FAILURE,
    error,
  };
}

export function fetchAllPosts() {
  return async (dispatch) => {
    dispatch(fetchAllPostsRequest());

    return ApiClient('/v1/posts/list', 'post')
      .then(res => dispatch(fetchAllPostsSuccess(res)))
      .catch(res => dispatch(fetchAllPostsFailure(res)));
  };
}

export function fetchAllPostsIfNeeded() {
  return (dispatch, getState) => {
    const { posts = {} } = getState().post;

    if (posts.data.length === 0 && !posts.error) {
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
    data: response,
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

    return ApiClient('/v1/posts/get', 'post', {
      slug,
    })
      .then(res => dispatch(fetchSinglePostSuccess(res)))
      .catch(res => dispatch(fetchSinglePostFailure(res)));
  };
}

export function fetchSinglePostIfNeeded(params) {
  return (dispatch, getState) => {
    const { post = {} } = getState().post;

    if ((post.slug !== params.slug) && !post.error) {
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

    return ApiClient('/v1/posts/remove', 'post', {
      slug,
    });
  };
}

// Create a Post

function addPost(data) {
  return { type: POST_ADD, data };
}

export function createPost(title, content) {
  return (dispatch) => {
    const name = 'Admin';

    return ApiClient('/v1/posts/create', 'post', {
      post: {
        title,
        content,
        name,
      },
    }).then(res => dispatch(addPost(res)));
  };
}

/*
 * REDUCER
 */

const defaultState = {
  post: {
    data: {},
  },
  posts: {
    data: [],
  },
};

// Reducer
export default function reducer(state = defaultState, action) {
  const { type } = action;
  let newState = state;

  switch (type) {
    case POSTS_LOAD: {
      newState = {
        ...state,
        posts: {
          loading: true,
          data: [],
        },
      };

      break;
    }

    case POSTS_LOAD_SUCCESS: {
      newState = {
        ...state,
        posts: {
          loading: false,
          data: [...action.data],
        },
      };

      break;
    }

    case POSTS_LOAD_FAILURE: {
      newState = {
        ...state,
        posts: {
          loading: false,
          data: [],
          ...action,
        },
      };

      break;
    }

    case POST_LOAD: {
      newState = {
        ...state,
        post: {
          loading: true,
          data: {},
        },
      };

      break;
    }

    case POST_LOAD_SUCCESS: {
      newState = {
        ...state,
        post: {
          loading: false,
          data: { ...action.data },
        },
      };

      break;
    }

    case POST_LOAD_FAILURE: {
      newState = {
        ...state,
        post: {
          loading: false,
          data: {},
          ...action,
        },
      };

      break;
    }

    case POST_REMOVE: {
      newState = {
        ...state,
        posts: {
          ...state.posts,
          data: state.posts.data.filter(post => post.slug !== action.slug),
        },
      };

      break;
    }

    case POST_ADD: {
      newState = {
        ...state,
        posts: {
          ...state.posts,
          data: [action.data, ...state.posts.data],
        },
      };

      break;
    }

    default: {
      newState = state;
    }
  }

  return newState;
}
