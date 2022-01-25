import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { $storex } from '@/store'

export const namespaced = true

export const state = () => ({
  calls: [],
  currentCall: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setCalls (state, calls) {
    state.calls = calls
  },
  setCurrentCall (state, id) {
    state.currentCall = state.calls.filter(c => c.id === id)[0]
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    async createNewCall (ctx, settings) {
      $storex.call.setCalls([{
        id: 1,
        ...settings
      }])
      $storex.call.setCurrentCall(1)
    },
    async endCurrentCall () {
      $storex.call.setCurrentCall()
    }
  },
)