'use strict';

/**
 *  chat controller
 */
 const uuid = require('uuid').v4;
 const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::chat.chat', ({ strapi }) => ({
  async create (ctx) {
    const { name } = ctx.params
    const data = {
      admins: [ctx.state.user],
      name,
      roomId: `${uuid()}`
    }
    const { id } = await strapi.$api('chat').create({ data })
    return this.findOne({ params: { id }})
  },
  async findOne ({ params: { id } }) {
    const chat = await strapi.$api('chat').findOne(id, { populate: { admins: true, guests: true } })
    const messages = await strapi.$query('chat-message').findMany({
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
    const { guests = [], admins } = await strapi.$api('chat').findOne(id, { populate: { admins: true, guests: true } })
    const data = {}
    if (guest) {
      data.guests = [...guests, guest]
    } 
    if (admin) {
      data.admins = [...admins, admin]
    }
    return await strapi.$api('chat').update(id, { data })
  }
}));
