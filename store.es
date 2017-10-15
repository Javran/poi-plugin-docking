import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { mkSimpleReducer } from 'subtender'

import { store } from 'views/create-store'

const initState = {
  /*
     (TODO) simple layout: has less columns,
     works better if there isn't enough space for the plugin
   */
  simple: false,
  sort: {
    // valid methods: rid / type / name / level / dtime / perhp
    method: 'dtime',
    reverse: false,
  },
}

const tyModify = '@poi-plugin-docking@Modify'
const tyReady = '@poi-plugin-docking@Ready'

const reducer = mkSimpleReducer(
  initState,
  tyModify,
  tyReady
)

const actionCreators = {
  ready: newState => ({
    type: tyReady,
    newState,
  }),
  modify: modifier => ({
    type: tyModify,
    modifier,
  }),
}

const mapDispatchToProps = _.memoize(dispatch =>
  bindActionCreators(actionCreators, dispatch))

const withBoundActionCreators = (func, dispatch=store.dispatch) =>
  func(mapDispatchToProps(dispatch))

export {
  initState,
  reducer,
  actionCreators,
  mapDispatchToProps,
  withBoundActionCreators,
}
