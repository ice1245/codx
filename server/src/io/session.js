module.exports = strapi => {
  return {
    async status (user) {
      return {
        network: this.network(user)
      }
    },
    network (user) {
      const { network: { friends } } = user
      return {
        friends: friends.map(f => ({
          ...f,  
          online: !!strapi.io.onlineUsers[f.id],
        }))
      }
    }
  }
}