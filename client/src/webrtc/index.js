import RTCMulticonnection from './AsyncRTCMulticonnection'
import io from 'socket.io-client'
import { Stream } from 'stream'

window.io = io

export default class WebRTCRoom {
  connection = null
  roomId = null
  streams = {}
  constructor ({ video, audio }) {
    this.connection = new RTCMulticonnection()
    this.connection.socketURL = `${process.env.VUE_APP_API}/`
    this.connection.session = {
        audio,
        video
    }
    this.connection.onstream = this.onStream.bind(this)
  }

  static async newRoom (settings) {
    const room = new WebRTCRoom(settings)
    await room.connect(settings)
    return room
  }

  async connect ({ name }) {
    const { isRoomCreated, roomId } = await this.connection.openOrJoin(name)
    this.roomId = roomId
    console.log("rtc", "Room openend", isRoomCreated, roomId)
  }

  onStream(stream) {
    const { streams } = this
    const { userid } = stream
    this.streams = {
      ...streams,
      [userid]: Stream
    }
  }
}