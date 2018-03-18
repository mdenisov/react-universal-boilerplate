import { createSelector } from 'reselect';

// selector
const getPost = state => state.post.post;

// reselect function
export const getPostState = createSelector(
  [getPost],
  post => post,
);

export default { getPostState };
