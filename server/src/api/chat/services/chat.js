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
    await strapi.$query('chat-message').deleteMany({ where: { chat: id } })
    return super.delete(id)
  }
}));
