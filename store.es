import { mkSimpleReducer } from 'subtender'

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

const tyModify = '@@poi-plugin-docking@Modify'
const tyReady = '@@poi-plugin-docking@Ready'

const reducer = mkSimpleReducer(
  initState,
  tyModify,
  tyReady
)

export {
  reducer,
}
