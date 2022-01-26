import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { $storex } from '@/store'
import WebRTCRoom from '@/webrtc'

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
      const { type = "audio" } = settings
      const rtc = await WebRTCRoom.newRoom({
        video: type === "video",
        audio: true,
        userid: $storex.user.user.id
      })
      $storex.call.setCalls([{
        id: 1,
        ...settings,
        callee: $storex.user.user,
        rtc
      }])
      $storex.call.setCurrentCall(1)
    },
    async endCurrentCall ({ state }) {
      await state.currentCall.rtc.disconnect()
      $storex.call.setCurrentCall()
    }
  },
)