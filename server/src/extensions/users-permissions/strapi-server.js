const controllers = require('./controllers');
module.exports = plugin => {
  plugin.controllers = controllers(plugin)
  return plugin
}