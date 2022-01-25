import { getterTree, mutationTree, actionTree } from 'typed-vuex'
export const namespaced = true

export const state = () => ({
  clinics: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setClinics (state, clinics) {
    state.clinics = clinics
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    }
  },
)