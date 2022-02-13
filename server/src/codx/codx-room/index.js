const cloudProviders = require('../../cloudprovider')
const uuid = require('uuid').v4;

module.exports = strapi => ({
  async createRoom ({ user, provider: providerName, settings = {} }) {
    const providerSettings = await strapi.$query('cloud-provider').findMany({ 
      filters: { name: providerName },
    })
    console.log("codx-room", "createRoom", { user, providerName, settings, providerSettings })
    const provider = cloudProviders[providerName](providerSettings[0].settings)
    const env = [
      ['CODX_AUTH_TOKEN', user.token],
      ['NEKO_PASSWORD', `${uuid()}`.slice(0, 5)],
      ['NEKO_PASSWORD_ADMIN', `${uuid()}`.slice(0, 5)]
    ]
    const room = await provider.createRoom({
      room: {
        ...settings,
        name: uuid(),
        env
      }
    })
    return {
      ...room,
      env,
      "cloud-provider": providerName
    }
  },
  async deleteRoom ({ room, provider: providerName }) {
    const providerSettings = await strapi.$query('cloud-provider').findMany({ 
      filters: { name: providerName },
    })
    const provider = cloudProviders[providerName](providerSettings[0].settings)
    await provider.deleteRoom(room)
  }
})