module.exports = ({ controllers }) => {
  const { user } = controllers
  const orgMe = user.me
  user.me = async ctx => {
    await orgMe(ctx)
    const sme = ctx.body
    const ds = new Date().getTime()
    ctx.body = {
      ...sme,
      roomId: `@${sme.username}`,
      session: {
        lastOpenChat: 1
      },
      chats: [
        {
          id: 1,
          starred: true,
          users: [
            { id: 10, username: 'Marc-D', avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
            sme
          ],
          messages: [
            { from: 10, to: sme.id, content: { message: "Hey!" }, ts: ds - 60000 },
            { from: sme.id, to: 10, content: { message: "Hey!" }, ts: new Date() - 10000 },
            { from: sme.id, to: 10, content: { message: "how's going?" }, ts: new Date() }
          ]
        },
        {
          id: 2,
          starred: true,
          users: [
            { id: 20, username: 'JoeyRM10', avatar: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraightStrand&accessoriesType=Sunglasses&hairColor=Blonde&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=CollarSweater&clotheColor=Gray01&eyeType=Side&eyebrowType=Default&mouthType=Serious&skinColor=Black" },
            sme
          ],
          messages: [
            { from: 20, to: sme.id, content: { message: "Hey!" }, ts: ds - 60000 },
            { from: sme.id, to: 20, content: { message: "Hey!" }, ts: new Date() - 10000 },
            { from: sme.id, to: 20, content: { message: "how's going?" }, ts: new Date() },
            { from: 20, to: sme.id, content: { message: "Hey!" }, ts: ds - 60000 },
            { from: sme.id, to: 20, content: { message: "Hey!" }, ts: new Date() - 10000 },
            { from: sme.id, to: 20, content: { message: "how's going?" }, ts: new Date() },
            { from: 20, to: sme.id, content: { message: "Hey!" }, ts: ds - 60000 },
            { from: sme.id, to: 20, content: { message: "Hey!" }, ts: new Date() - 10000 },
            { from: sme.id, to: 20, content: { message: "how's going?" }, ts: new Date() },
            { from: 20, to: sme.id, content: { message: "Hey!" }, ts: ds - 60000 },
            { from: sme.id, to: 20, content: { message: "Hey!" }, ts: new Date() - 10000 },
            { from: sme.id, to: 20, content: { message: "how's going?" }, ts: new Date() }
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