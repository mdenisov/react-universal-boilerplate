import Timeout from 'koa-better-timeout';

function timeoutMiddleware(options = {}) {
  const { ms = 3000 } = options;

  return async function timeout(ctx, next) {
    try {
      const tm = new Timeout({
        ms,
        message: 'REQUEST_TIMED_OUT',
      });

      await tm.middleware(ctx, next);
    } catch (err) {
      ctx.throw(err);
    }
  };
}

export default timeoutMiddleware;
