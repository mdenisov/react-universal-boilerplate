import Boom from 'boom';

import Logger from '../utils/logger';
import services from './services';

const logger = Logger.create('API');

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

  ctx.api = true;
  ctx.type = 'json';

  if (service) {
    ctx.params = params;

    logger.info(`call ${urlPath.join(' --> ')}`, '|', `body ${JSON.stringify(ctx.request.body)}`);

    await service(ctx);
  } else {
    ctx.throw(Boom.notFound());
  }
}

export default api;
