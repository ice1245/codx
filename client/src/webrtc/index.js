import RTCMulticonnection from './AsyncRTCMulticonnection'
import io from 'socket.io-client'

window.io = io

function randomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toLowerCase();
}
function makeid (slots) {
  const res = []
  for(let c = 0; c < slots; ++c) {
    res.push(randomString(3))
  }
  return res.join("-")
}

export default class WebRTCRoom {
  connection = null
  roomId = null
  streams = {}
  constructor (settings) {
    const { video, audio } = settings
    this.connection = RTCMulticonnection()
    this.connection.socketURL = `${process.env.VUE_APP_API}/`
    this.connection.session = {
        audio,
        video,
        data: true
    }
    this.connection.extra = this.encodeExtra(settings)
    this.connection.onstream = this.onStream.bind(this)
  }

  static async newRoom (settings) {
    const room = new WebRTCRoom(settings)
    await room.connect(settings)
    return room
  }

  async connect ({ name }) {
    const { isRoomCreated, roomId } = await this.connection.openOrJoin(name || makeid(3))
    this.roomId = roomId
    console.log("rtc", "Room openend", isRoomCreated, roomId)
  }

  encodeExtra (extra) {
    return encodeURIComponent(JSON.stringify(extra))
  }

  decodeExtra (extra) {
    try {
      return JSON.parse(decodeURIComponent(extra))
    } catch (ex) {
      console.error('Error decoding user extra', ex)
    }
    return {}
  }

  disconnect () {
    const { connection } = this
    // disconnect with all users
    connection.getAllParticipants().forEach(pid => connection.disconnectWith(pid));

    // stop all local cameras
    connection.attachStreams.forEach(localStream => localStream.stop());

    // close socket.io connection
    connection.closeSocket()
    this.connection = null
  }

  onStream(event) {
    const { streams } = this
    const extra = this.decodeExtra(event.extra)
    this.streams = {
      ...streams,
      [extra.userid]: {
        ...event,
        extra
      }
    }
  }

  get socket () {
    const { connection: { socket } } = this
    return socket
  }
}