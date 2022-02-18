const cloudProviders = require('../../cloudprovider')
const nekoRooms = require('../../neko-rooms')
const uuid = require('uuid').v4;

module.exports = strapi => ({
  exposeRoomService ({ username, roomName, serviceId, ip }) {
    const pathPrefix = `/@${username}/clinic/${roomName}`
    return {
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
                url:  `http://${ip}:8080`
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
  createRoomProxyInfo ({ name: roomName, user: { username }, room: { config: { name: serviceId }, data: { server: { id, public_net: { ipv4: { ip } } } }}}) {
    const url = `https://${process.env.WEB_DOMAIN}${pathPrefix}`
    const wurl = `wss://${process.env.WEB_DOMAIN}${pathPrefix}/ws`
    return {
      username,
      roomName,
      ip: ipv4.ip,
      id,
      url,
      wurl,
      ...this.exposeRoomService({ username, roomName, serviceId, ip })
    }
  },
  async waitForRoom () {
    const wait = tout => new Promise(r => setTimeout(r, tout))
    return wait(5000)
  },
  async createRoom ({ user, provider: providerName, settings }) {
    const { powerSize: { type } } = settings
    if (type === 'container') {
      return this.createContainer({ user, settings })
    }
    return this.createVps({ user, providerName, settings })
  },
  async createContainer ({ user, settings = {} }) {
    const { repository, folder, powerSize: { image: neko_image = "codx/room:latest" } } = settings
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
      }
    }
    const room = await nekoRooms.create(nekoSettings)
    return {
      proxy: {
        url: room.url,
      },
      neko: {
        ...room,
        nekoSettings,
      },
      nekoAdminPwd,
      nekoPwd,
      config: settings
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
    const proxy = this.createRoomProxyInfo({ user, room, name: settings.name })
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
    const { config: { powerSize: { type } } } = room
    if (type === 'container') {
      return this.deleteContainer(room)
    }
    return this.deleteVps(room)
  },
  async deleteContainer ({ neko: { id } }) {
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