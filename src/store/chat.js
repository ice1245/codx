import { getterTree, mutationTree, actionTree } from 'typed-vuex'
export const namespaced = true

// import { useFetch } from "@/api/useFetch";

export const state = () => ({
  chats: [],
  onlineUsers: {}
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setChats (state, chats) {
    state.chats = chats
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
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    }
  },
)