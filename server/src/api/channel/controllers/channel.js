'use strict';

/**
 *  channel controller
 */

const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::channel.channel', ({ strapi }) => ({
  async create (ctx) {
    const data = {
      ...ctx.request.body,
      user: ctx.state.user
    }
    return strapi.$api('channel').create({ data })
  }
}))
