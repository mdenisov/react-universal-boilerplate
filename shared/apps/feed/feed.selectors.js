import { createSelector } from 'reselect';

// selectors
const getPosts = state => state.feed.posts;
const getPost = state => state.feed.post;

// reselect functions
export const getPostsState = createSelector(
  [getPosts],
  posts => posts,
);

export const getPostState = createSelector(
  [getPost],
  post => post,
);

export default { getPostsState, getPostState };
