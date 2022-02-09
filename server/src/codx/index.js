const user = require('./user')

module.exports = strapi => ({
  user: user(strapi)
})