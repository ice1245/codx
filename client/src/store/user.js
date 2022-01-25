/* eslint no-empty-pattern: 0 */
import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { $storex } from '@/store'
import WebRTCRoom from '../webrtc'

export const namespaced = true

import api from '@/api'

export const state = () => ({
  authenticated: false,
  token: localStorage.getItem("token") || "",
  user: null,
  lastLogin: null,
  userRoom: null,
  session: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  async onSignup (state, { authenticated, user, token }) {
    state.authenticated = authenticated
    state.token = token
    state.user = user
    state.lastLogin = new Date()
    const { chats, channels, clinics, session = {}, roomId } = user || {}
    state.session = session
    $storex.chat.setChats(chats)
    $storex.chat.setChannels(channels)
    $storex.clinic.setClinics(clinics)
    $storex.chat.setOpenedChat(session.lastOpenChat)
    if (user) {
      state.userRoom = await WebRTCRoom.newRoom({ name: roomId })
    } else if(state.userRoom){
      state.userRoom.disconnect()
      state.userRoom = null
    }
  },
  setOpenedChat ({ session }, id) {
    session.lastOpenChat = id
    $storex.chat.setOpenedChat(session.lastOpenChat)
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchAccessToken({ state: { lastLogin }}) {
      const token = localStorage.getItem("token")
      const fecthPayload = {
        authenticated: false
      }
      if (token) {
        if (lastLogin && (new Date() - lastLogin) < 60000) { 
          return
        }
        try {
          const { data: user } = await api.me(token)
          fecthPayload.authenticated = true
          fecthPayload.user = user
          fecthPayload.token = token
        } catch (ex) {
          console.error("Invalid token: ", token)
        }
      }
      $storex.user.onSignup(fecthPayload)
    },
    async signup({}, signload) {
      try {
        const { data: { jwt: token }} = await api.signup(signload)
        const { data: user } = await api.me(token)
        const payload = {
          token: token,
          user: user,
          authenticated: true,
        }
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        $storex.user.onSignup(payload)
        this.app.$toast.open({
          message: "Sign Up Successfully!!",
          type: "success",
          duration: 1000,
          dismissible: true,
          position: "top-right",
        })
        } catch (e) {
          this.app.$toast.open({
            message: e.response?.data?.error?.message,
            type: "error",
            duration: 1000,
            dismissible: true,
            position: "top-right",
          })
        }
    },
    async login({}, loginload) {
      try {
        const { data: { jwt: token }} = await api.login(loginload)
        const { data: user } = await api.me(token)
        const payload = {
          token: token,
          user: user,
          authenticated: true,
        }
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", token)
        $storex.user.onSignup(payload)
        this.app.$toast.open({
          message: "Login Successfully!",
          type: "success",
          duration: 1000,
          dismissible: true,
          position: "top-right",
        })
      } catch(e) {
        this.app.$toast.open({
          message: e.response?.data?.error?.message,
          type: "error",
          duration: 1000,
          dismissible: true,
          position: "top-right",
        })
      }
    },
    async logout () {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      $storex.user.onSignup({ authenticated: false })
    }
  }
)