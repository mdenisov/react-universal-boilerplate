export const checkStatus = (response) => {
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
};

export const parseJSON = (response) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  return response.json().then(json => ({ json, response }));
};
