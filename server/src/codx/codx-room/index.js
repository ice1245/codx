const cloudProviders = require('../../cloudprovider')
const NekoRooms = require('../../neko-rooms')
const uuid = require('uuid').v4;

module.exports = strapi => {
  return {
    exposeRoomService ({ username, roomName, serviceId, serviceUrl, prefix }) {
      const { pathPrefix, url, wurl } = this.getRoomPublicUrls({ username, roomName })
      const middlewares = {
        [`codx-room-${serviceId}prf`]: {
          stripPrefix: {
            prefixes: [
              pathPrefix + "/"
            ],
            forceSlash: true
          }
        },
        [`codx-room-${serviceId}rdr`]: {
          redirectRegex: {
            regex: pathPrefix + "$",
            replacement: pathPrefix + "/"
          }
        },
      }
      if (prefix) {
        middlewares[`codx-room-${serviceId}add`] = {
          addprefix: {
            prefix: `/${prefix}`
          }
        }
      }
      return {
        url,
        wurl,
        middlewares,
        services: {
          [`codx-room-${serviceId}`]: {
            loadBalancer: {
              servers: [
                {
                  url: serviceUrl
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
            middlewares: Object.keys(middlewares),
            service: `codx-room-${serviceId}`,
            rule: "Host(`codx.meetnav.com`) && PathPrefix(`" + pathPrefix + "`)",
            tls: {
              "certResolver": process.env.PROXY_TLS_RESOLVER || "myresolver"
            }
          }
        }
      }
    },
    getRoomPublicUrls ({ username, roomName}) {
      const pathPrefix = `/@${username}/clinic/${roomName}`
      return {
        url: `https://${process.env.WEB_DOMAIN}${pathPrefix}`,
        wurl: `wss://${process.env.WEB_DOMAIN}${pathPrefix}/ws`,
        pathPrefix
      }
    },
    createRoomProxyInfo ({ id, username, roomName, ip, serviceId, serviceUrl, prefix }) {
      return {
        username,
        roomName,
        ip,
        id,
        ...this.exposeRoomService({ username, roomName, serviceId, serviceUrl, prefix })
      }
    },
    async waitForRoom () {
      const wait = tout => new Promise(r => setTimeout(r, tout))
      return wait(5000)
    },
    async createRoom ({ user, settings }) {
      const { roomSettings: { type } } = settings
      if (type === 'container') {
        return this.createContainer({ user, settings })
      }
      return this.createVps({ user, settings })
    },
    async createContainer ({ user, settings = {} }) {
      const {
        template: { repository, folder },
        roomSettings: { provider, image: neko_image = "codx/room:latest" }
      } = settings
      const [nekoRoomsProvider = {}] = await strapi.$query('cloud-provider').findMany({ filters: { name: provider }})
      console.log("create container", { provider, nekoRoomsProvider })
      const { mounts = [] } = nekoRoomsProvider.settings || {}
      const nekoRooms = new NekoRooms(nekoRoomsProvider.settings)

      const nekoPwd = `${uuid()}`.slice(0, 5)
      const nekoAdminPwd = `${uuid()}`.slice(0, 5)
      const nekoSettings = {
        admin_pass: nekoAdminPwd,
        user_pass: nekoPwd,
        audio_bitrate: 128,
        audio_codec: "OPUS",
        audio_pipeline: "",
        broadcast_pipeline: "",
        control_protection: false,
        envs: {},
        implicit_control: true,
        max_connections: 10,
        mounts: [],
        name: "",
        neko_image,
        screen: "1280x720@30",
        video_bitrate: 3072,
        video_codec: "VP8",
        video_max_fps: 25,
        video_pipeline: "",
        envs: {
          GIT_REPO_PROJECT: repository,
          GIT_REPO_FOLDER: folder,
          ...user.envs
        },
        mounts
      }
      const room = await nekoRooms.create(nekoSettings)
      const proxyInfo = { 
        id: room.id, 
        username: user.username,
        roomName: settings.name, 
        ip: null, 
        serviceId: settings.name,
        serviceUrl: room.url,
        prefix: room.name
      }
      const proxy = this.createRoomProxyInfo(proxyInfo)
      return {
        proxy,
        neko: {
          ...room,
          nekoSettings,
        },
        nekoAdminPwd,
        nekoPwd,
        config: settings,
        provider
      }
    },
    async createVps ({ user, providerName, settings }) {
      const providerSettings = await strapi.$query('cloud-provider').findMany({ 
        filters: { name: providerName },
      })
      console.log("codx-room", "createRoom", { user, providerName, settings, providerSettings })
      const provider = cloudProviders[providerName](providerSettings[0].settings)
      const nekoPwd = `${uuid()}`.slice(0, 5)
      const nekoAdminPwd = `${uuid()}`.slice(0, 5)
      const { repository, folder } = settings
      const env = [
        ['CODX_AUTH_TOKEN', user.token],
        ['NEKO_PASSWORD', nekoPwd],
        ['NEKO_ADMIN_PASSWORD', nekoAdminPwd],
        ['API_DOMAIN', process.env.API_DOMAIN],
        ['GIT_REPO_PROJECT',  repository],
        ['GIT_REPO_FOLDER',  folder]
      ]
      const room = await provider.createRoom({
        room: {
          ...settings,
          env,
          name: uuid()
        }
      })
      const proxyInfo = { 
        id: room.data.server.id, 
        username: user.username, 
        roomName: settings.name, 
        ip: room.data.server.public_net.ipv4.ip, 
        serviceId: room.config.name,
        serviceUrl: room.proxy.url
      }
      const proxy = this.createRoomProxyInfo(proxyInfo)
      await this.waitForRoom()
      return {
        ...room,
        proxy,
        nekoAdminPwd,
        nekoPwd,  
        cloudProvider: providerName,
        config: settings
      }
    },
    deleteRoom (room) {
      const { config: { roomSettings: { type } } } = room
      if (type === 'container') {
        return this.deleteContainer(room)
      }
      return this.deleteVps(room)
    },
    async deleteContainer ({ neko: { id }, config: { roomSettings: { provider } } }) {
      const [nekoRoomsProvider = {}] = await strapi.$query('cloud-provider').findMany({ filters: { name: provider }})
      console.log("delete container", { provider, nekoRoomsProvider })
      const nekoRooms = new NekoRooms(nekoRoomsProvider.settings)
      return nekoRooms.delete(id)
    },
    async deleteVps ({ cloudProvider: providerName }) {
      const providerSettings = await strapi.$query('cloud-provider').findMany({ 
        filters: { name: providerName },
      })
      const provider = cloudProviders[providerName](providerSettings[0].settings)
      await provider.deleteRoom(room)
    },
    async listRooms (user = {}) {
      const nekoRooms = await strapi.$query('neko-room').findMany({
        filters: { 
          $or: [
            { user: [user.id] },
            { chat: {
                $or: [
                  { admins: [user.id] },
                  { guests: [user.id] }
                ]
              },
            }
          ]
        }
      })
      return nekoRooms.map(this.getRoomPublicInfo.bind(this))
    },
    getRoomPublicInfo ({ id, name, description, createdAt, room: { nekoPwd, nekoAdminPwd, proxy: { url } } }) {
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
  }
}