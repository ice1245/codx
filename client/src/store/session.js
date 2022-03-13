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
  socket: state => state.userRoom?.socket
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
        if (state.lastHeartBeat && (new Date() - state.lastHeartBeat) > 30000) {
          console.error("session", "user offline")
          state.isOnline = false
          if (!socket.connected) {
            $storex.session.init()
          }
        }
        const { user: { id, username, network: { friends } } } = $storex.user
        const { chats = {}, openedChat } = $storex.chat
        socket.emit('heartbeat', {
          id,
          username,
          chats: Object.keys(chats).map(k => parseInt(k)),
          openedChat: openedChat?.id,
          network: {
            friends: friends?.map(f => f.id)
          }
        })
      }
      state.heartbeat = setInterval(heartbeat, 10000)
      heartbeat()

      socket.on('chat-message', (msg, callbackFn) => {
        try {
          $storex.chat.addMessage(msg)
          callbackFn()
        } catch (ex) {
          console.error(ex)
          callbackFn(ex)
        }
      })
      socket.on('heartbeat', data => {
        const { network: { friends } } = data
        state.lastHeartBeat = new Date()
        state.isOnline = true
        $storex.network.updateFriendStatus(friends)
      })
      socket.on('welcome', () => {
        $storex.user.fetchAccessToken()
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
        const room = await WebRTCRoom.newRoom({
          name: roomId,
          turnUser: user.webrtc?.turnUser,
          turnPassword: user.webrtc?.turnPassword
        })
        $storex.session.setRoom(room)
      } else if(state.userRoom){
        $storex.session.setRoom(null)
      }
    },
    log (_, log) {
      const { user: { id, username } = {} } = $storex.user
      const { socket } =  $storex.session
      socket && socket.emit('log', { user: { id, username }, log })
    }
  },
)