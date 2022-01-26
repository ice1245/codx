import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { $storex } from '@/store'

export const namespaced = true

export const state = () => ({
  clinics: null,
  currentClinic: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setClinics (state, clinics) {
    state.clinics = clinics
  },
  setCurrentClinic (state, id) {
    state.currentClinic = state.clinics.filter(c => c.id === id)[0]
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    openClinic({ state }, clinic) {
      $storex.clinic.setClinics([
        {
          id: 1,
          url: `https://codx.meetnav.com/@${$storex.user.user.username}/coder`
        }
      ])
      $storex.clinic.setCurrentClinic(1)
    }
  },
)