import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  extensionSelectorFactory,
  fleetsSelector,
} from 'views/utils/selectors'

import { initState } from '../store'

const extSelector = createSelector(
  extensionSelectorFactory('poi-plugin-docking'),
  ext => _.isEmpty(ext) ? initState : ext
)

const readySelector = createSelector(
  extSelector,
  ext => ext.ready
)

const sortSelector = createSelector(
  extSelector,
  ext => ext.sort
)

const simpleSelector = createSelector(
  extSelector,
  ext => ext.simple
)

const hideUnlockedSelector = createSelector(
  extSelector,
  ext => ext.hideUnlocked
)

const healthFilterSelector = createSelector(
  extSelector,
  ext => ext.healthFilter
)

// TODO: seems to be matching, docking time from store?
// _.values(getStore().const.$shipTypes).map(d => d.api_scnt / 2)
// _.values(getStore().const.$shipTypes).map(d => getDockingFactor(d.api_id))

// reference: http://kancolle.wikia.com/wiki/Docking
/* eslint-disable indent */
const getDockingFactor = stype =>
  [9, 10, 11, 18, 19].includes(stype) ? 2 :
  [5, 6, 8, 7, 20].includes(stype) ? 1.5 :
  [2, 3, 4, 21, 16, 14, 17, 22].includes(stype) ? 1 :
  [13, 1].includes(stype) ? 0.5 : NaN
/* eslint-enable indent */

const computePerHp = (stype,level) => {
  const baseTime = level <= 11 ?
    level*10 :
    level*5+Math.floor(Math.sqrt(level-11))*10+50

  return baseTime*getDockingFactor(stype)
}

const computeHealthState = (now,max) => {
  if (now === max)
    return 'full'
  const percent = now/max * 100
  /* eslint-disable indent */
  return percent <= 25 ? 'taiha' :
    percent <= 50 ? 'chuuha' :
    percent <= 75 ? 'shouha' :
    'normal'
  /* eslint-enable indent */
}

// return an Object whose keys are <fleetId> and values
// Array of masterIds
const fleetShipIdsSelector = createSelector(
  fleetsSelector,
  fleetsRaw => _.fromPairs(
    _.flatMap(
      _.toPairs(fleetsRaw),
      ([_k, fleetRaw]) => {
        if (_.isEmpty(fleetRaw) || !('api_ship' in fleetRaw))
          return []
        const shipIds = fleetRaw.api_ship.filter(x => x > 0)
        return [[fleetRaw.api_id, shipIds]]
      }
    )
  )
)

export {
  extSelector,
  readySelector,
  sortSelector,
  simpleSelector,
  hideUnlockedSelector,
  healthFilterSelector,
  getDockingFactor,
  computePerHp,
  computeHealthState,
  fleetShipIdsSelector,
}
