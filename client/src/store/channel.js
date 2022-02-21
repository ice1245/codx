import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { $storex } from '@/store'
import api from '@/api'

export const namespaced = true

export const state = () => ({
  channels: null,
  currentChannel: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setChannels (state, channels = []) {
    state.channels = channels.sort((a, b) => a.name >= b.name ? -1 : 1)
  },
  setCurrentChannel (state, channel) {
    state.currentChannel = channel
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    async openChannel (ctx, channel = {}) {
      $storex.channel.setCurrentChannel(channel)
    },
    async createChannel ({ state: { channels }}, channelSettings) {
      const { user: { id } } = $storex.user
      const { data: channel } = await api.createChanne({
        ...channelSettings,
        users: [id],
        user: id,
        entries: []
      })
      $storex.channel.setChannels([...channels, channel])
    }
  },
)