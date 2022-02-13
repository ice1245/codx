const user = require('./user')
const room = require('./codx-room')

module.exports = strapi => ({
  user: user(strapi),
  room: room(strapi)
})