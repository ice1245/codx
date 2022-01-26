const { NETWORK_SERVICE, CHAT_SERVICE } = require('../../../api/constants')

module.exports = ({ controllers }) => {
  const { user } = controllers
  const orgMe = user.me
  const guest10 = { id: 10, username: 'Marc-D', avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
  const guest20 = { id: 20, username: 'JoeyRM10', avatar: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraightStrand&accessoriesType=Sunglasses&hairColor=Blonde&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=CollarSweater&clotheColor=Gray01&eyeType=Side&eyebrowType=Default&mouthType=Serious&skinColor=Black" }
  user.me = async ctx => {
    await orgMe(ctx)
    const sme = ctx.body
    const networks = await strapi.entityService.findMany(NETWORK_SERVICE, { 
      filters: { user: sme.id },
      populate: { friends: true, following: true, followed: true }
    })
    const guestChats = await strapi.entityService.findMany(CHAT_SERVICE, { 
      filters: { guests: [sme.id] },
      populate: { admins: true, guests: true }
    })
    const adminChats = await strapi.entityService.findMany(CHAT_SERVICE, { 
      filters: { admins: [sme.id] },
      populate: { admins: true, guests: true }
    })
    const ds = new Date().getTime()
    ctx.body = {
      ...sme,
      roomId: `@${sme.username}`,
      session: {},
      network: networks[0],
      chats: [
        ...guestChats,
        ...adminChats,
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
      ],
      clinics: [
        { id: 1, name: "c# fix observable", room: {} }
      ]
    }
  }
  return controllers
}