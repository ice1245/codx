module.exports = (strapi, codx) => ({
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
  async subscriptions ({ id }) {
    const subs = await strapi.$query('user-subscription').findMany({
      filter: { user: id, active: true },
      populate: { company: true, subscription: true }
    })
    const freeSubs = await strapi.$query('subscription').findMany({
      filters: { free: true }
    })
    return [
      freeSubs.map(({ settings:subscription }) => ({
        personal: true,
        subscription
      }))[0],
      ...subs.map(({company, subscription}) => ({
        company: company?.id,
        subscription: subscription.settings
      }))
    ]
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
    const clinics = await codx.room.listRooms()
    const companies = await strapi.$query('company').findMany({ 
      filters: { users: [sme.id] }
    })
    const subscriptions = await this.subscriptions(sme)
    const ds = new Date().getTime()
    const chats = [...guestChats, ...adminChats]
    const channels = chats.filter(c => c.channel).map(({ channel }) => ({ channel }))
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
})