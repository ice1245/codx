import { getterTree, mutationTree, actionTree } from 'typed-vuex'

import { $storex } from '@/store'
import api from '@/api'

export const namespaced = true

export const state = () => ({
  currentChannel: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setCurrentChannel (state, channel) {
    state.currentChannel = channel ? {
      ...channel,
      search: {
        topic: "",
        results: [
          { votes: 100, title: 'How do I undo a change on git?', tags: ['git', 'codding'],
            answers: [
              { ts: new Date().getTime(), user: { username: 'gbrian', avatar: 'https://avatars.dicebear.com/api/open-peeps/test.svg' },
                text: `#Some question text in markdown
                * entry 1
                * entry 2
              
              and more info ` },
              { ts: new Date().getTime(), user: { username: 'gbrian', avatar: 'https://avatars.dicebear.com/api/open-peeps/test.svg' },
                text: `#Some question text in markdown
                * entry 1
                * entry 2
              
              and more info ` },
              { ts: new Date().getTime(), user: { username: 'gbrian', avatar: 'https://avatars.dicebear.com/api/open-peeps/test.svg' },
                text: `#Some question text in markdown
                * entry 1
                * entry 2
              
              and more info ` },
              { ts: new Date().getTime(), user: { username: 'gbrian', avatar: 'https://avatars.dicebear.com/api/open-peeps/test.svg' },
                text: `#Some question text in markdown
                * entry 1
                * entry 2
              
              and more info ` },
              { ts: new Date().getTime(), user: { username: 'gbrian', avatar: 'https://avatars.dicebear.com/api/open-peeps/test.svg' },
                text: `#Some question text in markdown
                * entry 1
                * entry 2
              
              and more info ` },
              { ts: new Date().getTime(), user: { username: 'gbrian', avatar: 'https://avatars.dicebear.com/api/open-peeps/test.svg' },
                text: `#Some question text in markdown
                * entry 1
                * entry 2
              
              and more info ` },
              { ts: new Date().getTime(), user: { username: 'gbrian', avatar: 'https://avatars.dicebear.com/api/open-peeps/test.svg' },
                text: `#Some question text in markdown
                * entry 1
                * entry 2
              
              and more info ` },
              { ts: new Date().getTime(), user: { username: 'gbrian', avatar: 'https://avatars.dicebear.com/api/open-peeps/test.svg' },
                text: `#Some question text in markdown
                * entry 1
                * entry 2
              
              and more info ` },
              { ts: new Date().getTime(), user: { username: 'gbrian', avatar: 'https://avatars.dicebear.com/api/open-peeps/test.svg' },
                text: `#Some question text in markdown
                * entry 1
                * entry 2
              
              and more info ` },
              { ts: new Date().getTime(), user: { username: 'gbrian', avatar: 'https://avatars.dicebear.com/api/open-peeps/test.svg' },
                text: `#Some question text in markdown
                * entry 1
                * entry 2
              
              and more info ` },
              { ts: new Date().getTime(), user: { username: 'gbrian', avatar: 'https://avatars.dicebear.com/api/open-peeps/test.svg' },
                text: `#Some question text in markdown
                * entry 1
                * entry 2
              
              and more info ` },
              { ts: new Date().getTime(), user: { username: 'gbrian', avatar: 'https://avatars.dicebear.com/api/open-peeps/test.svg' },
                text: `#Some question text in markdown
                * entry 1
                * entry 2
              
              and more info ` },
            ]
          },
          { votes: 20, title: 'Error when executing something after having done something silly', tags: ['error', 'codding', 'docker', 'data'], answers: [1,1,1,1,1,1] },
          { votes: 0, title: 'How I can extract some data from something', tags: ['git', 'codding', 'tag-data', 'error', 'codding',], answers: [1,1,1,1,1,1] },
          { votes: 100, title: 'How do I undo a change on git?', tags: ['git', 'codding'], answers: [1,1,1,1,1,1] },
          { votes: 20, title: 'Error when executing something after having done something silly', tags: ['error', 'codding', 'docker', 'data'], answers: [1,1,1,1,1,1] },
          { votes: 0, title: 'How I can extract some data from something', tags: ['git', 'codding', 'tag-data', 'error', 'codding',], answers: [1,1,1,1,1,1] },
          { votes: 100, title: 'How do I undo a change on git?', tags: ['git', 'codding'], answers: [1,1,1,1,1,1] },
          { votes: 20, title: 'Error when executing something after having done something silly', tags: ['error', 'codding', 'docker', 'data'], answers: [1,1,1,1,1,1] },
          { votes: 0, title: 'How I can extract some data from something', tags: ['git', 'codding', 'tag-data', 'error', 'codding',], answers: [1,1,1,1,1,1] },
          { votes: 20, title: 'Error when executing something after having done something silly', tags: ['error', 'codding', 'docker', 'data'], answers: [1,1,1,1,1,1] },
          { votes: 0, title: 'How I can extract some data from something', tags: ['git', 'codding', 'tag-data', 'error', 'codding',], answers: [1,1,1,1,1,1] },
          { votes: 100, title: 'How do I undo a change on git?', tags: ['git', 'codding'], answers: [1,1,1,1,1,1] },
          { votes: 20, title: 'Error when executing something after having done something silly', tags: ['error', 'codding', 'docker', 'data'], answers: [1,1,1,1,1,1] },
          { votes: 0, title: 'How I can extract some data from something', tags: ['git', 'codding', 'tag-data', 'error', 'codding',], answers: [1,1,1,1,1,1] },
          { votes: 100, title: 'How do I undo a change on git?', tags: ['git', 'codding'], answers: [1,1,1,1,1,1] },
          { votes: 20, title: 'Error when executing something after having done something silly', tags: ['error', 'codding', 'docker', 'data'], answers: [1,1,1,1,1,1] },
          { votes: 0, title: 'How I can extract some data from something', tags: ['git', 'codding', 'tag-data', 'error', 'codding',], answers: [1,1,1,1,1,1] },
        ]
      }
    } : null
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    async openChannel (ctx, channel = {}) {
      $storex.channel.setCurrentChannel(channel)
    }
  },
)