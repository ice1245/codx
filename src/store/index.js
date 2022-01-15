import Vuex from 'vuex'
import {
  useAccessor,
} from 'typed-vuex'

import * as auth from './auth' 
import * as chat from './chat' 

const storePattern = {
  modules: { auth, chat },
}

const store = new Vuex.Store(storePattern)

export const $storex = useAccessor(store, storePattern)
window.$storex = $storex
export default store