import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { $storex } from '@/store'
import api from '@/api'

export const namespaced = true

export const state = () => ({
  currentCompany: null,
  tasks: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  async setCurrentCompany (state, { id }) {
    const { data: company } = await api.getCompany(id)
    state.currentCompany = company
    state.tasks = company.tasks
  },
  addTask (state, task) {
    if (!state.tasks) {
      state.tasks = []
    }
    state.tasks = [...state.tasks, task]
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    async createTask({ state }, category) {
      const company = state.currentCompany.id
      const { data: task } = await api.createTask({ category, company })
      $storex.company.addTask(task)
    }
  },
)