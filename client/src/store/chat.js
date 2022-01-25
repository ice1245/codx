import { getterTree, mutationTree, actionTree } from 'typed-vuex'
export const namespaced = true

export const state = () => ({
  chats: [],
  onlineUsers: {},
  channels: null,
  openedChat: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setChats (state, chats) {
    state.chats = chats
  },
  setChannels (state, channels) {
    state.channels = channels
  },
  setOnlineUser (state, user) {
    const { onlineUsers } = state
    const { id } = user
    if (!user.online) {
      delete onlineUsers[id]
    } else {
      onlineUsers[id] = user
    }
    state.onlineUsers = {
      ...onlineUsers
    }
  },
  setOpenedChat (state, id) {
    state.openedChat = state.chats.filter(c => c.id === id)[0]
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    }
  },
)