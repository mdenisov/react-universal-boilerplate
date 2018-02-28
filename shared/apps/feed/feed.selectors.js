import { createSelector } from 'reselect';

const getPosts = state => state.posts;
const getPostsState = createSelector(
  [getPosts],
  posts => posts,
);
