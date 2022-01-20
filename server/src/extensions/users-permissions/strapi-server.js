const controllers = require('./controllers');
module.exports = plugin => {
  plugin.controllers = controllers(plugin)
  console.log("Plugin user ", plugin)
  return plugin
}