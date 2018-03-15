import Timeout from 'koa-better-timeout';

function timeout(options) {
  const { logger } = options;

  return async function (ctx, next) {
    try {
      const tm = new Timeout({
        ms: 3000,
        message: 'REQUEST_TIMED_OUT',
      });

      await tm.middleware(ctx, next);
    } catch (err) {
      if (logger) {
        logger.error(err);
      }

      ctx.throw(err);
    }
  };
}

export default timeout;
