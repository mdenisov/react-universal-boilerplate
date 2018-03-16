import debug from 'debug'; // eslint-disable-line

import services from './services';

const log = debug('API');

function mapPathForService(availableServices = {}, url = []) {
  const notFound = { service: null, params: [] };

  // test for empty input
  if (url.length === 0 || Object.keys(availableServices).length === 0) {
    return notFound;
  }

  const reducer = (prev, current) => {
    let res = notFound;
    if (prev.service && prev.service[current]) {
      res = { service: prev.service[current], params: [] }; // go deeper
    } else if (typeof prev.service === 'function') {
      res = { service: prev.service, params: prev.params.concat(current) }; // params are found
    }

    return res;
  };

  const actionAndParams = url.reduce(reducer, { service: availableServices, params: [] });

  return (typeof actionAndParams.service === 'function') ? actionAndParams : notFound;
}

async function api(ctx) {
  const urlPath = ctx.request.url.split('?')[0].split('/');
  const { service, params } = await mapPathForService(services, urlPath);

  // console.log('api => ', urlPath, service, params);

  ctx.type = 'json';

  if (service) {
    ctx.params = params;

    log(`call ${urlPath.join(' --> ')}`, '|', `body ${JSON.stringify(ctx.request.body)}`);

    try {
      const result = await service(ctx);

      ctx.status = 200;
      ctx.body = result;
    } catch (e) {
      const { statusCode, payload } = e.output;

      ctx.status = statusCode || 500;
      ctx.body = payload || { message: 'Internal Error' };
    }
  } else {
    ctx.status = 404;
    ctx.body = 'NOT FOUND';
  }
}

export default api;
