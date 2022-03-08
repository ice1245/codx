module.exports = (config, { strapi })=> {
  return async (ctx, next) => {
    try {
      await next()
    } catch (ex) {
      const { request: { url } } = ctx
      console.error("middleware", "log-error", { url, ex })
      throw ex
    }
  };
};