'use strict';

/**
 *  company controller
 */

 const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::company.company', ({ strapi }) => {
  return {
    async findOne ({ params: { id }, state: { user }}) {
      const company = await strapi.$query('company').findOne(id)
      const taskList = await strapi.$query('task').findMany({
        filters: { company: id },
        populate: { chat: true }
      })
      for(let c = 0; c != taskList.length; ++c) {
        const { chat: { id: chatId }} = taskList[c]
        taskList[c].entryLine = (await strapi.$query('chat-message').findMany({
          filters: { chat: chatId },
          limit: 1
        }))[0]
      }
      const { tasks: { categories } } = (company.settings || { tasks: { categories: {} }})
      let tasks = {}
      Object.keys(categories).forEach(c => {
        tasks = {
          ...tasks,
          [c]: taskList.filter(({ category }) => c === category)
        }
      })
      return {
        ...company,
        tasks
      }
    }
  }
});
