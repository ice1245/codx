'use strict';

/**
 *  chat controller
 */
 const { uuid } = require('uuidv4');
const { createCoreController } = require('@strapi/strapi').factories;

const { CHAT_SERVICE, CHAT_MESSAGE_SERVICE } = require('../../constants')
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
    const chat = await strapi.entityService.findOne(CHAT_SERVICE, id, { populate: { admins: true, guests: true } })
    const messages = await strapi.entityService.findMany(CHAT_MESSAGE_SERVICE, {
      filters: { chat: id },
      populate: { from: true }
    })
    return {
      ...chat,
      messages
    }
  },
  async update (ctx) {
    const { id } = ctx.params
    const { request: { body: { guest, admin } }} = ctx
    const { guests = [], admins } = await strapi.entityService.findOne(CHAT_SERVICE, id, { populate: { admins: true, guests: true } })
    const data = {}
    if (guest) {
      data.guests = [...guests, guest]
    } 
    if (admin) {
      data.admins = [...admins, admin]
    }
    return await strapi.entityService.update(CHAT_SERVICE, id, { data })
  }
}));
