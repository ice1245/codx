import Vuex from 'vuex'
import {
  useAccessor,
} from 'typed-vuex'

import * as user from './user'
import * as chat from './chat'
import * as clinic from './clinic'

const storePattern = {
  modules: { user, chat, clinic },
}

const store = new Vuex.Store(storePattern)

export const $storex = useAccessor(store, storePattern)
window.$storex = $storex
export default store