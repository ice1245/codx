'use strict';

/**
 * channel service.
 */

const { createCoreService } = require('../../strapix')

const populate = {
  entries: {
    populate: {
      chat_message: {
        populate: {
          chat: true
        }
      }
    }
  }
}
module.exports = createCoreService('api::channel.channel', ({ strapi }) => ({
  async findOne (id, params = {}) {
    params.populate = {
      ...params.populate,
      ...populate
    }
    const channel = await strapi.$query('channel').findOne(id, params)
    return channel
  },
  async findMany (params = {}) {
    params.populate = {
      ...params.populate,
      ...populate
    }
    return strapi.$query('channel').findMany(params)
  },
}));
