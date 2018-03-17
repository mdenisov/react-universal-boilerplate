import fetch from 'isomorphic-fetch';

import { checkStatus, parseJSON } from './network';

export const API_URL = (typeof window === 'undefined' || process.env.NODE_ENV === 'test')
  ? 'http://localhost:8000/api'
  : '/api';

function ApiClient(endpoint, method = 'post', body) {
  return fetch(`${API_URL}${endpoint}`, {
    cache: 'default',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    method,
    body: JSON.stringify(body),
  })
    .then(checkStatus)
    .then(parseJSON);
}

export default ApiClient;
