module.exports = ({ controllers }) => {
  const { user } = controllers
  const orgMe = user.me
  user.me = async ctx => {
    console.log("me endpoint org ", orgMe)
    await orgMe(ctx)
    const sme = ctx.body
    console.log("users/me hacked!!!", sme)
    ctx.body = {
      ...sme,
      chats: [
        {
          starred: true,
          users: [
            { id: 1, username: 'test', avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
          ],
          messages: [
            { from: 1, to: 2, content: { message: "Hey!" }, ts: new Date() },
            { from: 1, to: 2, content: { message: "Hey!" }, ts: new Date() },
            { from: 1, to: 2, content: { message: "Hey!" }, ts: new Date() }
          ]
        }
      ],
      channels: [
        { id: 1, name: "c-sharp-devs" },
        { id: 2, name: "svelt-training" },
        { id: 3, name: "company-support" },
      ],
      live: [
        { id: 1, name: "c# fix observable", room: {} }
      ]
    }
  }
  return controllers
}