/* eslint no-empty-pattern: 0 */
import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { $storex } from '@/store'

export const namespaced = true

import api from '@/api'

export const state = () => ({
  authenticated: false,
  token: localStorage.getItem("token") || "",
  user: null,
  lastLogin: null
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  onSignup (state, { authenticated, user, token }) {
    state.authenticated = authenticated
    state.token = token
    state.user = user
    state.lastLogin = new Date()
    const { chats, channels, live } = user
    $storex.chat.setChats(chats)
    $storex.chat.setChannels(channels)
    $storex.chat.setLive(live)
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
      $storex.auth.onSignup(fecthPayload)
    },
    async signup({}, signload) {
      try {
        const res = await api.signup(signload)
        const payload = {
          token: res?.data?.jwt,
          user: res?.data?.user,
          authenticated: true,
        }
        localStorage.setItem("token", res?.data?.jwt)
        localStorage.setItem("user", JSON.stringify(res?.data?.user))
        $storex.auth.onSignup(payload)
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
        const res = await api.login(loginload)
          const payload = {
            token: res?.data?.jwt,
            user: res?.data?.user,
            authenticated: true,
          }
          localStorage.setItem("user", JSON.stringify(res?.data?.user))
          localStorage.setItem("token", res?.data?.jwt)
          $storex.auth.onSignup(payload)
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
      $storex.auth.onSignup({ authenticated: false })
    }
  }
)