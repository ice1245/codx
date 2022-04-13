'use strict';

/**
 * network service.
 */
const { createCoreService } = require('../../strapix')

module.exports = createCoreService('api::network.network', ({ strapi }) => ({
  async update ({ user, friends }) {
    const users = [...friends, user]
    users.forEach(async u => {
      const network = await strapi.$api('network').find({ filters: { user: u.id }})[0]
    })
  }
}));