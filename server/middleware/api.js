function api(options) {
  const { prefix = '/api/', app = () => {} } = options;

  return async function (ctx, next) {
    if (ctx.path.indexOf(prefix) === 0) {
      ctx.path = ctx.path.replace(prefix, '') || '/';

      return await app.apply(null, [ctx, next]); // eslint-disable-line
    }

    await next();
  };
}

export default api;
