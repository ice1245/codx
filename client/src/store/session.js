import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import WebRTCRoom from '@/webrtc'
import { $storex } from '.'

export const namespaced = true

export const state = () => ({
  userRoom: null,
  heartbeat: null,
  lastHeartBeat: null,
  isOnline: false
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setRoom (state, room) {
    if (state.userRoom) {
      state.userRoom.disconnect()
      clearInterval(state.heartbeat)
      state.heartbeat = null
    }
    state.userRoom = room
    if (room) {
      const { socket } = room
      const heartbeat = () => {
        if ((new Date() - state.lastHeartBeat) > 10000) {
          state.isOnline = false
        }
        socket.emit('heartbeat', $storex.user.user)
      }
      state.heartbeat = setInterval(heartbeat, 5000)

      socket.on('chat-message', msg => {
        $storex.chat.addMessage(msg)
      })
      socket.on('heartbeat', ts => {
        state.lastHeartBeat = Date.parse(ts)
        state.isOnline = true
      })
    }
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async init ({ state }) {
      const user = $storex.user.user
      if (user) {
        const { roomId } = user
        const room = await WebRTCRoom.newRoom({ name: roomId })
        $storex.session.setRoom(room)
      } else if(state.userRoom){
        $storex.session.setRoom(null)
      }
    }
  },
)