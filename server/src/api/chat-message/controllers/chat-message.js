'use strict';

/**
 *  chat-message controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { CHAT_MESSAGE_SERVICE, CHAT_SERVICE } = require('../../constants')

module.exports = createCoreController(CHAT_MESSAGE_SERVICE, ({ strapi }) => ({
  async create ({ request: { body } }) {
    const { chat, from, content, extra } = body
    const data = {
      chat,
      from,
      content,
      extra
    }
    const msg = await strapi.entityService.create(CHAT_MESSAGE_SERVICE, { data })
    const { id } = chat
    const { admins = [], guests = [] } = await strapi.entityService.findOne(CHAT_SERVICE, id, { populate: { admins: true, guests: true } })
    const evData = { 
      ...msg,
      from: { id: from.id },
      chat: { id }
    }
    strapi.io.emit('chat-message', evData, admins.concat(guests).map(u => u.id))
    return msg
  }
}));
