import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { $storex } from '@/store'
import api from '@/api'

export const namespaced = true

export const state = () => ({
  currentSearch: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setCurrentSearch (state, search) {
    state.currentSearch = search
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    async doSearch (ctx, query = {}) {
      const { data: { results } } = await api.search(query)
      $storex.search.setCurrentSearch({
        query,
        results
      })
    }
  },
)