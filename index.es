import { DockingMain as reactClass } from './ui'
import { reducer } from './store'

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
}
