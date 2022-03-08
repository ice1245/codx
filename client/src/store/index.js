import { createStore } from 'vuex'
import {
  useAccessor,
} from 'typed-vuex'

import * as user from './user'
import * as chat from './chat'
import * as clinic from './clinic'
import * as call from './call'
import * as session from './session'
import * as network from './network'
import * as search from './search'
import * as channel from './channel'
import * as company from './company'

const storePattern = {
  modules: { user, chat, clinic, call, session, network, search, channel, company },
}

const store = createStore(storePattern)

export const $storex = useAccessor(store, storePattern)
window.$storex = $storex
export default store