module.exports = {
  routes: [
    { // Path defined with a URL parameter
      method: 'GET',
      path: '/neko-rooms/proxy',
      handler: 'neko-room.proxy',
    }
  ]
}