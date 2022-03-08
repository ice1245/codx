'use strict';

/**
 *  clinic-template controller
 */

 const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::clinic-template.clinic-template', ({ strapi }) => ({
  async find () {
    return await strapi.$api('clinic-template').find({ populate: { user: true } })
  }
}));
