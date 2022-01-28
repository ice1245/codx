'use strict';

/**
 * chat service.
 */

const { createCoreService } = require('../../strapix')

module.exports = createCoreService('api::chat.chat', ({ strapi }) => ({
  async findOne (id) {
    return super.findOne(id, { populate: { admins: true, guests: true }})
  }
}));
