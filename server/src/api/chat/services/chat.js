'use strict';

/**
 * chat service.
 */

const { createCoreService } = require('../../strapix')

module.exports = createCoreService('api::chat.chat', ({ strapi }) => ({
  async findOne (id) {
    return super.findOne(id, { populate: { admins: true, guests: true }})
  },
  async delete (id) {
    const messages = await strapi.$query('chat-message').findMany({ filters: { chat: id } })
    await Promise.all(messages.map(({ id }) => strapi.$query('chat-message').delete(id)))
    return super.delete(id)
  }
}));
