import fetch from 'isomorphic-fetch';

export const API_URL = (typeof window === 'undefined' || process.env.NODE_ENV === 'test')
  ? 'http://localhost:8000/api'
  : '/api';

function ApiClient(endpoint, method = 'post', body) {
  return fetch(`${API_URL}${endpoint}`, {
    cache: 'default',
    headers: {
      'content-type': 'application/json',
    },
    method,
    body: JSON.stringify(body),
  })
    .then(response => response.json().then(json => ({ json, response })))
    .then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json.message);
      }

      return json;
    });
}

export default ApiClient;
