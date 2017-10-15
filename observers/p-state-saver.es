import _ from 'lodash'

import {
  createSelector,
  createStructuredSelector,
} from 'reselect'
import { observer } from 'redux-observers'

import { stateToPState, savePState } from '../p-state'
import {
  extSelector,
  readySelector,
} from '../selectors'

const pStateSelector = createSelector(
  extSelector,
  ext => stateToPState(ext)
)

const debouncedSavePState = _.debounce(
  pState => setTimeout(() => savePState(pState)),
  500
)

const pStateSaver = observer(
  createStructuredSelector({
    ready: readySelector,
    pState: pStateSelector,
  }),
  (_dispatch, cur, prev) => {
    if (!cur.ready)
      return
    if (cur.pState !== prev.pState) {
      debouncedSavePState(cur.pState)
    }
  }
)

export { pStateSaver }
