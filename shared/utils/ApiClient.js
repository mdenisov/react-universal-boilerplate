import fetch from 'isomorphic-fetch';
import _merge from 'lodash/merge';

const METHODS = ['post'];
const API_PATH = '/api';
const DEFAULT_OPTIONS = {
  cache: 'default',
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
};

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

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;

  if (__SERVER__ || process.env.NODE_ENV === 'test') {
    // Prepend host and port of the API server to the path.
    return `http://localhost:8000${API_PATH}${adjustedPath}`;
  }

  return `${API_PATH}${adjustedPath}`;
}

class ApiClient {
  constructor() {
    METHODS.forEach((method) => {
      this[method] = (path, { params = {}, data = {} } = {}) => {
        const endpoint = formatUrl(path);
        const options = _merge({ method }, DEFAULT_OPTIONS, params) || {};

        options.body = JSON.stringify(data);

        return fetch(endpoint, options)
          .then(checkStatus)
          .then(parseJSON);
      };
    });
  }
}

export default new ApiClient();
