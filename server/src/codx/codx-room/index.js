const cloudProviders = require('../../cloudprovider')
const uuid = require('uuid').v4;

module.exports = strapi => ({
  createRoomProxyInfo ({ name: roomName, user: { username }, room: { config: { name: serviceId }, data: { server: { id, public_net: { ipv4 } } }}}) {
    const pathPrefix = `/@${username}/clinic/${roomName}`
    const url = `https://${process.env.WEB_DOMAIN}${pathPrefix}`
    const wurl = `wss://${process.env.WEB_DOMAIN}${pathPrefix}/ws`
    return {
      username,
      roomName,
      ip: ipv4.ip,
      id,
      url,
      wurl,
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
  },
  async waitForRoom () {
    const wait = tout => new Promise(r => setTimeout(r, tout))
    return wait(5000)
  },
  async createRoom ({ user, provider: providerName, settings = {} }) {
    const providerSettings = await strapi.$query('cloud-provider').findMany({ 
      filters: { name: providerName },
    })
    console.log("codx-room", "createRoom", { user, providerName, settings, providerSettings })
    const provider = cloudProviders[providerName](providerSettings[0].settings)
    const nekoPwd = `${uuid()}`.slice(0, 5)
    const nekoAdminPwd = `${uuid()}`.slice(0, 5)
    const env = [
      ['CODX_AUTH_TOKEN', user.token],
      ['NEKO_PASSWORD', nekoPwd],
      ['NEKO_ADMIN_PASSWORD', nekoAdminPwd],
      ['API_DOMAIN', process.env.API_DOMAIN]
    ]
    const room = await provider.createRoom({
      room: {
        ...settings,
        env,
        name: uuid()
      }
    })
    const proxy = this.createRoomProxyInfo({ user, room, name: settings.name })
    await this.waitForRoom()
    return {
      ...room,
      proxy,
      nekoAdminPwd,
      nekoPwd,  
      "cloud-provider": providerName
    }
  },
  async deleteRoom ({ room, provider: providerName }) {
    const providerSettings = await strapi.$query('cloud-provider').findMany({ 
      filters: { name: providerName },
    })
    const provider = cloudProviders[providerName](providerSettings[0].settings)
    await provider.deleteRoom(room)
  },
  async listRooms (user = {}) {
    const nekoRooms = await strapi.$query('neko-room').findMany({
    })
    return nekoRooms.map(this.getRoomPublicInfo)
  },
  getRoomPublicInfo ({ id, name, description, createdAt, room: { nekoPwd, nekoAdminPwd, proxy: { url } }}) {
    return {
      id,
      name,
      description,
      createdAt,
      url,
      nekoPwd,
      nekoAdminPwd
    }
  }
})