import { DockingMain as reactClass } from './ui'
import { reducer, withBoundActionCreators } from './store'
import { loadPState } from './p-state'
import { globalSubscribe, globalUnsubscribe } from './observers'

const pluginDidLoad = () => {
  globalSubscribe()
  setTimeout(() =>
    withBoundActionCreators(bac => {
      const pState = loadPState()
      if (pState !== null) {
        const {simple, sort} = pState
        bac.ready({simple, sort})
      } else {
        bac.ready(undefined)
      }
    })
  )
}

const pluginWillUnload = globalUnsubscribe

const switchPluginPath = [
  {
    path: '/kcsapi/api_get_member/ndock',
    valid: () => true,
  },
]

export {
  reducer,
  reactClass,
  switchPluginPath,
  pluginDidLoad,
  pluginWillUnload,
}
