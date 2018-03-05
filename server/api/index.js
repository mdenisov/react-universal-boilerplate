import Koa from 'koa';
import services from './services';

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
    } else {
      if (typeof prev.service === 'function') {
        res = { service: prev.service, params: prev.params.concat(current) }; // params are found
      }
    }

    return res;
  };

  const actionAndParams = url.reduce(reducer, { service: availableServices, params: [] });

  return (typeof actionAndParams.service === 'function') ? actionAndParams : notFound;
}

async function api(ctx, next) {
  const urlPath = ctx.request.url.split('?')[0].split('/');
  const { service, params } = await mapPathForService(services, urlPath);

  // await next();

  // console.log('api => ', urlPath, service, params);

  ctx.type = 'json';

  if (service) {
    ctx.params = params;

    return await service(ctx);
  }

  ctx.status = 404;
  ctx.body = 'NOT FOUND';
}

const app = new Koa();

app.use(api);

export default api;
