'use strict';

/**
 *  task controller
 */

const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::task.task', ({ strapi}) => {
  return {
    async create ({ request: { body: { category, company, content = "New task" } }, state: { user } }) {
      const chat = await strapi.$api('chat').create({ data: { admins: [ user ] } })
      const entryLine = await strapi.$api('chat-message').create({ data: {
        chat,
        content,
        from: user
      }})
      return strapi.$api('task').create({ data: {
        chat,
        company,
        category,
        owner: user,
        entryLine
      }})
    }
  }
});
