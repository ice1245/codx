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
      const room = await codx.room.createRoom({ user, provider: 'hetzner' })
      return await strapi.$api('neko-room').create({ data: {
        chat,
        settings,
        room,
        name: settings.name,
        description: settings.description
      }})
    },
    async find ({ state: { user }}) {
      return await strapi.$query('neko-room').findMany({
        filters: {
          chat: {
            $or: [
              { admins: user },
              { guests: user }
            ]
          }
        }
      })
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
      const nekoRooms = await strapi.$query('neko-room').findMany({
        populate: { user: true }
      })
      const routers = nekoRooms.map(({ name: roomName, user: { username }, room: { config: { name: serviceId }, data: { server: { id, public_net: { ipv4 } } }}}) => {
        const pathPrefix = `/@${username}/clinic/${roomName}`
        return {
          username,
          roomName,
          ip: ipv4.ip,
          id,
          middlewares: {
            [`codx-room-${serviceId}prf`]: {
              stripPrefix: {
                prefixes: [
                  pathPrefix + "/"
                ],
                forceSlash: true
              }
            },
            [`codx-room-${serviceId}rdr`]: {
              "redirectRegex": {
                "regex": pathPrefix + "$",
                "replacement": pathPrefix + "/"
              }
            }
          },
          services: {
            [`codx-room-${serviceId}`]: {
              loadBalancer: {
                servers: [
                  {
                    url:  `http://${ipv4.ip}:8080`
                  }
                ],
                passHostHeader: true
              }
            }
          },
          routers: {
            [`codx-room-${serviceId}`]: {
              entryPoints: [
                "websecure"
              ],
              middlewares: [
                `codx-room-${serviceId}rdr`,
                `codx-room-${serviceId}prf`
              ],
              service: `codx-room-${serviceId}`,
              rule: "Host(`codx.meetnav.com`) && PathPrefix(`" + pathPrefix + "`)",
              tls: {
                "certResolver": process.env.PROXY_TLS_RESOLVER || "myresolver"
              }
            }
          }
        }
      })
      const http = routers.reduce((conf, { middlewares, services, routers}) => {
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
