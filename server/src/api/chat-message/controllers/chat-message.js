'use strict';

/**
 *  chat-message controller
 */

const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::chat-message.chat-message', ({ strapi }) => ({
  async create ({ request: { body } }) {
    const { id: msgId, chat, from, content, extra, edited } = body
    const data = {
      chat,
      from,
      content,
      extra,
      edited
    }
    const msg = (msgId ? await strapi.$api('chat-message').update(msgId, { data }) :
      await strapi.$api('chat-message').create({ data }))
    const { id } = chat
    const { admins = [], guests = [] } = await strapi.$api('chat').findOne(id, { populate: { admins: true, guests: true } })
    const evData = { 
      ...msg,
      from: { id: from.id },
      chat: { id }
    }
    strapi.io.emit('chat-message', evData, admins.concat(guests).map(u => u.id))
    return msg
  }
}));
