const rtcmulticonnectionServer = require('rtcmulticonnection-server')
const socketIo = require('socket.io')
class ioManager {
  users = {}
  constructor(strapi) {
    this.strapi = strapi
    this.waitForServer()
  }

  get onlineUsers () {
    const now = new Date()
    return Object.keys(this.users)
      .filter(k => (now - this.users[k].lastOnline) <= 10000)
      .map(k => this.users[k])
      .reduce((acc, u) => {
        acc[u.id] = u
        return acc
      }, {})
  }

  get offlineUserIds () {
    const now = new Date()
    return Object.keys(this.users)
      .filter(k => (now - this.users[k].lastOnline) > 10000)
  }

  waitForServer () {
    if (!this.strapi.server) {
      setTimeout(() => {
        console.log("IO", "strapi server not ready")
        this.waitForServer()
      }, 500)
    }
    console.error("io", "Use strapi cors settings here")
    this.io = socketIo(strapi.server.httpServer, {
      cors: {
        origin: "*"
      }
    })
      .on('connection', (socket) => {
        this.onConnection(socket)
        rtcmulticonnectionServer.addSocket(socket);
        rtcmulticonnectionServer.pushLogs({}, 'ioManager', { message: 'Socket added to rtcmulticonnection-server' })
      })
    this.rooms = {}
    this.sockets = []
  }

  onConnection(socket) {
    // Say hi
    socket.emit("welcome", {})
    socket.on('heartbeat', user => this.onHeartBeat({ ...user, socket }))
  }

  onHeartBeat (user) {
    const { socket } = user
    this.users[user.id] = {
      ...user,
      lastOnline: new Date()
    }
    socket.emit('heartbeat', new Date())
    this.offlineUserIds.forEach(id => delete this.users[id])
  }

  emit (event, data, userIds = null) {
    if (!userIds) {
      userIds = Object.keys(this.onlineUsers)
    } 
    const users = userIds.map(id => this.onlineUsers[id]).filter(u => !!u)
    users.forEach(u => u.socket.emit(event, data))
  }
}

module.exports = ioManager
