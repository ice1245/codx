import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { $storex } from '.'

export const namespaced = true

export const state = () => ({
  friends: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setNetwork (state, { friends }) {
    state.friends = friends
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async init ({ state }) {
      const user = $storex.user.user
      if (user) {
        $storex.network.setNetwork(user.network)
      } else {
        $storex.network.setNetwork({})
      }
    }
  },
)