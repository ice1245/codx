module.exports = strapi => {
  return {
    filteredUser ({ avatar, blocked, email, id, username }) {
      return { avatar, blocked, email, id, username }
    },
    async network (user) {
      const networks = await strapi.$query('network').findMany({ 
        filters: { user: user.id },
        populate: { friends: true, following: true, followed: true }
      })
      const network = networks[0] || { friends: [], following: [], followed: [] }
      return {
        friends: network.friends.map(this.filteredUser),
        following: network.following.map(this.filteredUser),
        followed: network.followed.map(this.filteredUser),
      }
    },
    async subscriptions (companies = []) {
      const paidSubs = companies
                        .filter(({ settings }) => !!settings?.rooms)
                        .map(({ id, settings: { rooms } }) => ({
                          company: id,
                          subscription: rooms
                        }))
      const freeSubs = await strapi.$query('subscription').findMany({
        filters: { free: true }
      })
      return [
        freeSubs.map(({ settings: { rooms: subscription } }) => ({
          personal: true,
          subscription
        }))[0],
        ...paidSubs
      ]
    },
    async channels ({ id }) {
      return strapi.$query('channel').findMany({
        filters: {
          $or: [
            { users: [id] },
            { user: [id] }
          ]
        }
      })
    },
    async me (params) {
      const { id } = params
      const sme = await strapi.$query("users-permissions.user").findOne(id)
      const network = await this.network(sme)
      const guestChats = await strapi.$query('chat').findMany({ 
        filters: { guests: [sme.id] },
        populate: { admins: true, guests: true, channel: { entries: true } }
      })
      const adminChats = await strapi.$query('chat').findMany({ 
        filters: { admins: [sme.id] },
        populate: { admins: true, guests: true, channel: { entries: true } }
      })
      const clinics = await strapi.codx.room.listRooms(sme)
      const companies = await strapi.codx.company.companies(sme)
      const subscriptions = await this.subscriptions(companies)
      const ds = new Date().getTime()
      const chats = [...guestChats, ...adminChats]
      const channels = await this.channels(sme)
      return {
        ...this.filteredUser(sme),
        roomId: `@${sme.username}`,
        session: {},
        network,
        subscriptions,
        chats,
        channels,
        clinics,
        companies
      }
    }
  }
}