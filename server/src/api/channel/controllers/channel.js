'use strict';

/**
 *  channel controller
 */

const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::channel.channel', ({ strapi }) => ({
  async create (ctx) {
    const data = {
      ...ctx.request.body,
      user: ctx.state.user
    }
    return strapi.$api('channel').create({ data })
  },
  async update (ctx) {
    const { params: { id }, request: { body: { entry: content } }, state: { user: from } } = ctx
    const { entries = [] } = await strapi.$api('channel').findOne(id)
    const chat = await strapi.$api('chat').create({
      data: {
        admins: [from],
        tags: ['channel']
      }
    })
    const data = {
      chat,
      from,
      content
    }
    const chat_message = await strapi.$api('chat-message').create({ data })
    entries.push({
      chat_message,
      status: 'new'
    })
    return strapi.$api('channel').update(id, {
      data: {
        entries
      }
    })
  },
  async findOne (ctx) {
    const { params: { id } } = ctx
    return strapi.$api('channel').findOne(id)
  },
  async delete (ctx) {
    const { params: { id }, state: { user } } = ctx
    const { entries, user: channelOwner } = await strapi.$api('channel').findOne(id, { populate: { user: true } })
    if (user.id !== channelOwner.id) throw new Error("NotAllowed")
    entries.forEach(({ chat_message: { chat: { id } } }) => strapi.$api('chat').delete(id))
    return super.delete(id)
  }
}))
