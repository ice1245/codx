const rtcmulticonnectionServer = require('rtcmulticonnection-server')
const socketIo = require('socket.io')
class ioManager {
  constructor(strapi) {
    this.strapi = strapi
    this.waitForServer()
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
  }
}

module.exports = ioManager
