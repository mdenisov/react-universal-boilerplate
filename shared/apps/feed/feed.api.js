import ApiClient from '../../../shared/utils/ApiClient';

function fetchPosts() {
  return ApiClient.post('/v1/posts/list');
}

function fetchPost(data) {
  return ApiClient.post('/v1/posts/get', { data });
}

function removePosts(data) {
  return ApiClient.post('/v1/posts/remove', { data });
}

function createPost(data) {
  return ApiClient.post('/v1/posts/create', { data });
}

export default {
  fetchPosts,
  fetchPost,
  removePosts,
  createPost,
};
