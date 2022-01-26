'use strict';

/**
 *  chat controller
 */
 const { uuid } = require('uuidv4');
const { createCoreController } = require('@strapi/strapi').factories;

const { CHAT_SERVICE } = require('../../constants')
module.exports = createCoreController(CHAT_SERVICE, ({ strapi }) => ({
  async create (ctx) {
    const { name } = ctx.params
    const data = {
      admins: [ctx.state.user],
      name,
      roomId: `${uuid()}`
    }
    const { id } = await strapi.entityService.create(CHAT_SERVICE, { data })
    return this.findOne({ params: { id }})
  },
  async findOne ({ params: { id } }) {
    return await strapi.entityService.findOne(CHAT_SERVICE, id, { populate: { admins: true, guests: true } })
  }
}));
