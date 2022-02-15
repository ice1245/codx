'use strict';

/**
 *  neko-room controller
 */

const { createCoreController } = require('../../strapix')
const nekoRooms = require('../../../neko-rooms')

module.exports = createCoreController('api::neko-room.neko-room', ({ strapi }) => {
  const codx = require('../../../codx')(strapi)
  return {
    async create ({ request: { body, header: { authorization } }, state: { user } }) {
      let { chat = {}, settings } = body
      chat = chat.id ? await strapi.$api('chat').findOne(chat.id) : null
      user.token = authorization.split(" ")[1]
      const room = await codx.room.createRoom({ user, provider: 'hetzner', settings })
      const nekoRoom = await strapi.$api('neko-room').create({ data: {
        chat,
        settings,
        room,
        name: settings.name,
        description: settings.description
      }})
      return codx.room.getRoomPublicInfo(nekoRoom)
    },
    async find ({ state: { user }}) {
      return codx.room.listRooms(user)
    },
    async delete ({ state: { user }, params: { id } }) {
      const { room } = await strapi.$api('neko-room').findOne(id)
      console.log("neko-rooms", "delete", { user, room })
      await codx.room.deleteRoom({ room, provider: room['cloud-provider'] })
      return strapi.$api('neko-room').delete(id)
    },
    async proxy ({ query: { token }}) {
      const isValid = token === process.env.API_TOKEN
      if (!isValid) {
        return { isValid }
      }
      const nekoRooms = await strapi.$query('neko-room').findMany()
      const http = nekoRooms.reduce((conf, { room: { proxy: { middlewares, services, routers} } }) => {
        conf.middlewares = {
          ...conf.middlewares,
          ...middlewares
        }
        conf.services = {
          ...conf.services,
          ...services
        }
        conf.routers = {
          ...conf.routers,
          ...routers
        }
        return conf
      },
      { middlewares: {},
        services: {},
        routers: {}
      })
      return { http }
    }
  }
});
