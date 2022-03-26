module.exports = strapi => {
  return {
    async status (user) {
      return {
        network: this.network(user)
      }
    },
    network (user) {
      const { network: { friends }, chats, currentClinicChatId } = user
      return {
        friends: friends.map(fid => {
          const friend = strapi.io.onlineUsers[fid]
          if (!friend) {
            return null
          }
          const openedChat = chats.indexOf(friend.openedChat) !== -1 ? friend.openedChat : null
          return {
            id: fid,  
            online: true,
            openedChat,
            currentClinicChatId: friend.currentClinicChatId === openedChat ? friend.currentClinicChatId: null
          }
        }).filter(f => !!f)
      }
    }
  }
}