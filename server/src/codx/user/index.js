const guest10 = { id: 10, username: 'Marc-D', avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
const guest20 = { id: 20, username: 'JoeyRM10', avatar: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraightStrand&accessoriesType=Sunglasses&hairColor=Blonde&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=CollarSweater&clotheColor=Gray01&eyeType=Side&eyebrowType=Default&mouthType=Serious&skinColor=Black" }
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
      chats: [
        ...chats,
        {
          id: 1,
          starred: true,
          admins: [
            sme
          ],
          guests: [
            guest10
          ],
          messages: [
            { from: guest10, content: "Hey!", createdAt: ds - 60000 },
            { from: sme.id, content: "Hey!", createdAt: new Date() - 10000 },
            { from: sme.id, content: "how's going?", createdAt: new Date() }
          ]
        },
        {
          id: 2,
          starred: true,
          admins: [
            sme
          ],
          guests: [
            guest20
          ],
          messages: [
            { from: 20, to: sme.id, content: "Hey!", createdAt: ds - 60000 },
            { from: sme.id, to: 20, content: "Hey!", createdAt: new Date() - 10000 },
            { from: sme.id, to: 20, content: "how's going?", createdAt: new Date() },
            { from: 20, to: sme.id, content: "Hey!", createdAt: ds - 60000 },
            { from: sme.id, to: 20, content: "Hey!", createdAt: new Date() - 10000 },
            { from: sme.id, to: 20, content: "how's going?", createdAt: new Date() },
            { from: 20, to: sme.id, content: "Hey!", createdAt: ds - 60000 },
            { from: sme.id, to: 20, content: "Hey!", createdAt: new Date() - 10000 },
            { from: sme.id, to: 20, content: "how's going?", createdAt: new Date() },
            { from: 20, to: sme.id, content: "Hey!", createdAt: ds - 60000 },
            { from: sme.id, to: 20, content: "Hey!", createdAt: new Date() - 10000 },
            { from: sme.id, to: 20, content: "how's going?", createdAt: new Date() }
          ]
        }
      ],
      channels: [
        { id: 1, name: "c-sharp-devs" },
        { id: 2, name: "svelt-training" },
        { id: 3, name: "company-support" },
        ...channels
      ],
      clinics,
      companies
    }
  }
})