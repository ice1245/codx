module.exports = strapi => {
  return {
    async status (user) {
      return {
        network: this.network(user)
      }
    },
    network (user) {
      const { network: { friends }, chats } = user
      return {
        friends: friends.map(fid => {
          const friend = strapi.io.onlineUsers[fid]
          return friend ? {
            id: fid,  
            online: true,
            openedChat: chats.indexOf(friend.openedChat) !== -1 ? friend.openedChat : null
          } : null
        }).filter(f => !!f)
      }
    }
  }
}