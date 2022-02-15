const user = require('./user')
const room = require('./codx-room')

const codx = {}
module.exports = strapi => {
  codx.user = user(strapi, codx),
  codx.room = room(strapi, codx)
  return codx
}