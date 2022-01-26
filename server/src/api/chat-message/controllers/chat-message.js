'use strict';

/**
 *  chat-message controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { CHAT_MESSAGE_SERVICE, CHAT_SERVICE } = require('../../constants')

module.exports = createCoreController(CHAT_MESSAGE_SERVICE, ({ strapi }) => ({
  async create ({ request: { body } }) {
    const { chat: { id }, from, content } = body
    const data = {
      chat: id,
      from,
      content
    }
    const msg = await strapi.entityService.create(CHAT_MESSAGE_SERVICE, { data })
    const { admins = [], guests = [] } = await strapi.entityService.findOne(CHAT_SERVICE, id, { populate: { admins: true, guests: true } })
    const evData = { 
      chat: { id },
      from: from.id,
      content: { message: content },
      ts: msg.createdAt
    }
    strapi.io.emit('chat-message', evData, admins.concat(guests).map(u => u.id))
    return msg
  }
}));
