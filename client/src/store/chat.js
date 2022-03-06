import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import api from '@/api'

export const namespaced = true

export const state = () => ({
  chats: {},
  openedChat: null
})

export const getters = getterTree(state, {
  userChats: ({ chats }) => Object.keys(chats)
                            .map(k => chats[k])
                            .reduce((acc, c) => [acc, !c.isChannel && (acc[c.id] = c)][0], {})
})

export const mutations = mutationTree(state, {
  setChats ({}, chats = []) {
    chats.forEach(c => $storex.chat.addChat(c))
  },
  addChat (state, chat) {
    const { id, admins = [], guests = [] } = chat
    state.chats = {
      ...state.chats,
      [id]: {
        ...chat,
        admins,
        guests,
        get users () {
          return this.admins.concat(this.guests)
            .map(u => ($storex.network.allUsers||[])[u.id] || u)
        }
      }
    }
  },
  async setOpenedChat (state, id) {
    if (id) {
      const { data: chat } = await api.loadChat(id)
      $storex.chat.addChat(chat)
    }
    if (state.chats) {
      state.openedChat = state.chats[id]
    }
  },
  async addMessage (state, { id, chat: { id: chatId }, from, content, createdAt, extra, edited }) {
    if (!state.chats[chatId]) {
      await $storex.chat.refreshChat({ chatId })
    }
    const { messages = [] } = state.chats[chatId]
    const messageIx = messages.findIndex(m => m.id === id)
    const newMessage = {
      id, from, content, createdAt, extra, edited
    }
    if (messageIx !== -1) {
      messages.splice(messageIx, 1, newMessage)
    } else {
      messages.push(newMessage)  
    }
    state.chats = {
      ...state.chats,
      [chatId]: {
        ...state.chats[chatId],
        messages
      }
    }
    if (state.openedChat && id === state.openedChat.id) {
      state.openedChat = state.chats[id]
    }
  },
  async deleteChat (state, chat) {
    await api.deleteChat(chat)
    const { chats } = state
    delete chats[chat.id]
    state.chats = {
      ...chats,
    }
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
    },
    async newChat () {
      const { data: chat } = await api.createChat({})
      $storex.chat.addChat(chat)
      return chat
    },
    async sendMessage (ctx, { chat, content, extra, id }) {
      const { user: from } = $storex.user
      await api.sendMessage({ chat, content, from, extra, id })
    },
    async addUser (ctx, chatAddUser) {
      await api.chatAddUser(chatAddUser)
      $storex.chat.setOpenedChat(chatAddUser.chat.id)
    },
    async removeUser ({ state: { openedChat = {} }}, { user, chat }) {
      await api.removeUserFromChat({ user, chat })
      $storex.chat.setOpenedChat(openedChat.id)
    },
    async onEditMessage (ctx, { chat, message }) {
      await api.sendMessage({ chat, ...message })
    },
    async refreshChat (ctx, { id, isChannel = false }) {
      const { data: chat } = await api.loadChat(id)
      $storex.chat.addChat({ ...chat, isChannel })
      return chat
    }
  },
)