import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { $storex } from '.'

export const namespaced = true

export const state = () => ({
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async init ({ state }) {
      const _orgConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn
      }
      const callStack = () => {
        const { stack } = new Error()
        return stack
      }
      const __safeValue = v => {
        try {
          if (v instanceof Object) {
            v = Object.assign({}, v)
          }
          return `${v}`
        } catch (error) {
          _orgConsole.error("__safeValue unserializable", v)
        }
      }
      const remoteLogger = level => {
        return (...args) => {
          const stack = callStack()
          if (stack.indexOf('__safeValue') === -1) { // ¿?
            $storex.session.log({
              level,
              stack,
              ...args.reduce((acc, v, ix) => [acc, acc['arg_'+ix] = __safeValue(v)][0], {})
            })
          }
          _orgConsole[level](...args)
        }
      }
      console.log = remoteLogger('log')
      console.warn = remoteLogger('warn')
      console.error = remoteLogger('error')
    }
  },
)