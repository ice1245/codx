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
  onStreamsChanged = () => {}
  constructor (settings) {
    const { video, audio } = settings
    this.connection = RTCMulticonnection()
    this.connection.socketURL = `${process.env.VUE_APP_API}/`
    // STUN / TURN Servers
    this.connection.iceServers = []
    this.connection.iceServers.push({
      urls: 'stun:turn.meetnav.com:3478'
    })
    this.connection.iceServers.push({
      urls: 'turn:turn.meetnav.com:3478',
      credential: settings.turnPassword,
      username: settings.turnUser
    })
    this.connection.iceTransportPolicy = 'relay'
    this.connection.session = {
        audio,
        video,
        data: true
    }
    this.connection.extra = this.encodeExtra(settings)
    this.connection.onstream = this.onStream.bind(this)
    this.connection.onstreamended = this.onStreamEnded.bind(this)
    this.connection.onmute = this.onMute.bind(this)
    this.connection.onunmute = this.onUnMute.bind(this)
  }

  static async newRoom (settings) {
    const room = new WebRTCRoom(settings)
    const { onStreamsChanged } = settings
    if (onStreamsChanged) {
      room.onStreamsChanged = onStreamsChanged
    }
    await room.connect(settings)
    return room
  }

  async connect ({ roomId: name }) {
    this.roomId = name || makeid(3)
    const { isRoomCreated, roomId } = await this.connection.openOrJoin(this.roomId)
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
    this.onStreamsChanged(this)
  }

  onStreamEnded (event) {
    const { streamid } = event
    const k = Object.keys(this.streams).filter(k => this.streams[k].streamid === streamid)[0]
    if (k) {
      delete this.streams[k]
      this.onStreamsChanged(this)
    }
  }

  get socket () {
    const { connection: { socket } } = this
    return socket
  }

  get allStreams () {
    const { streams } = this
    return Object.values(streams)
  }

  get myStreams () {
    return this.allStreams
      .filter(s => s.type === 'local')
  }

  onMute (event) {
    const { streamid, muteType } = event
    const stream = this.allStreams.filter(s => s.streamid === streamid)[0]
    if (muteType === 'video') {
      if (stream.paused)
        return
      stream.paused = true
    }
    if (muteType === 'audio') {
      if (stream.muted)
        return
      stream.muted = true
    }
    this.onStreamsChanged(this)
    console.log("onmute", event)
  }

  onUnMute (event) {
    const { streamid, muteType } = event
    const stream = this.allStreams.filter(s => s.streamid === streamid)[0]
    if (muteType === 'video') {
      if (!stream.paused)
        return
      stream.paused = false
    }
    if (muteType === 'audio') {
      if (!stream.muted)
        return
      stream.muted = false
    }
    this.onStreamsChanged(this)
    console.log("onunmute", event)
  }

  toggleVideo () {
    this.myStreams.forEach(s => s.paused ? s.stream.unmute('video') : s.stream.mute('video'))
  }

  toggleAudio () {
    this.myStreams.forEach(s => s.muted ? s.stream.unmute('audio') : s.stream.mute('audio'))
  }
}