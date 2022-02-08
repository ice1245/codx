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
      .filter(k => (now - this.users[k].lastOnline) <= 60000)
      .map(k => this.users[k])
      .reduce((acc, u) => {
        acc[u.id] = u
        return acc
      }, {})
  }

  get offlineUserIds () {
    const now = new Date()
    return Object.keys(this.users)
      .filter(k => (now - this.users[k].lastOnline) > 60000)
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
    try {
      socket.emit("welcome", {})
      socket.on('heartbeat', user => this.onHeartBeat({ ...user, socket }))
      this.onHeartBeat({ ...user, socket })
    } catch (ex) {
      console.error("io", "new socket connection error", { ex })
    }
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
    try {
      console.log("io", "Emmiting ", { event, data, userIds })
      if (!userIds) {
        userIds = Object.keys(this.onlineUsers)
      } 
      const users = userIds.map(id => this.onlineUsers[id]).filter(u => !!u)
      users.forEach(u => {
        try {
          u.socket.emit(event, data, (response) => {
            console.log("io", "user ack", { id: u.id, status: response });
          })
        } catch (ex) {
          console.error("io", "Error emmiting to user", { id: u.id, event, ex })
        }
      })
    } catch (ex) {
      console.error("io", "Error emmiting ", { event, ex })
    }
  }
}

module.exports = ioManager
