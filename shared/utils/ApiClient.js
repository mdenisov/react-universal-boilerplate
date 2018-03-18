import fetch from 'isomorphic-fetch';

export const API_URL = (typeof window === 'undefined' || process.env.NODE_ENV === 'test')
  ? 'http://localhost:8000/api'
  : '/api';

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  return response
    .json()
    .then(json => Promise.reject({ // eslint-disable-line
      status: response.status,
      ok: false,
      statusText: response.statusText,
      message: json.message,
    }));
}

export function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  // return response.json().then(json => ({ json, response }));
  return response.json().then(json => json);
}


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
