import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  shipsSelector,
  constSelector,
  repairsSelector,
  fleetsSelector,
  equipsSelector,
} from 'views/utils/selectors'

import { sortToFunc } from '../sorter'

import {
  sortSelector,
  hideUnlockedSelector,
  healthFilterSelector,
  computePerHpFuncSelector,
  computeHealthState,
  fleetShipIdsSelector,
} from './common'

/*
   a list of ships that need docking, NF for non-full HP.
   ship's ordering is unspecified.

   - hideUnlocked is respected here.
 */
const nfShipIdListSelector = createSelector(
  shipsSelector,
  hideUnlockedSelector,
  (sObj, hideUnlocked) =>
    Object.values(sObj).filter(s =>
      s.api_ndock_time !== 0 && (
        hideUnlocked ?
          s.api_locked !== 0 :
          true
      )
    ).map(s => s.api_id)
)

const dockingShipIdsSelector = createSelector(
  repairsSelector,
  repairs => {
    if (!Array.isArray(repairs))
      return []
    return _.compact(
      repairs.map(rInfo => _.get(rInfo,'api_ship_id',0))
    )
  }
)

// return ship details, 'S0' means this is the "first stage",
// we'll later append some extra info that depends on 'S0'.
const getShipDetailFuncSelectorS0 = createSelector(
  shipsSelector,
  equipsSelector,
  constSelector,
  dockingShipIdsSelector,
  computePerHpFuncSelector,
  (ships, equips, {$ships,$shipTypes}, dockingShipIds, computePerHp) => _.memoize(
    rstId => {
      const ship = ships[rstId]
      if (_.isEmpty(ship))
        return null
      const mstId = ship.api_ship_id
      const $ship = $ships[mstId]
      const stype = $ship.api_stype
      const stypeInfo = $shipTypes[stype]
      const typeName = stypeInfo.api_name
      const hp = {
        now: ship.api_nowhp,
        max: ship.api_maxhp,
      }
      hp.rate = hp.now / hp.max
      const level = ship.api_lv
      const docking = {
        time: ship.api_ndock_time,
        perHp: computePerHp(stype,level),
        resource: {
          fuel: ship.api_ndock_item[0],
          steel: ship.api_ndock_item[1],
        },
        ongoing: dockingShipIds.includes(rstId),
      }
      const equipIds =
        [...ship.api_slot, ship.api_slot_ex].filter(
          eRid => eRid > 0 && equips[eRid]
        ).map(eRid =>
          equips[eRid].api_slotitem_id
        )

      return {
        rstId, mstId,
        name: $ship.api_name,
        level,
        sortNo: $ship.api_sortno,
        lock: Boolean(ship.api_locked),
        stype, typeName, hp, docking,
        healthState: computeHealthState(hp.now,hp.max),
        equipIds,
      }
    }
  )
)

// computes an Array of ship ids who are in range of
// anchorage repair
const anchorageCoverageSelector = createSelector(
  fleetsSelector,
  getShipDetailFuncSelectorS0,
  (fleets, getShipDetailS0) => {
    if (!Array.isArray(fleets))
      return []
    const fleetShipIds = _.flatMap(
      fleets,
      fleet => {
        // make sure the fleet is valid
        if (!('api_ship' in fleet) || !Array.isArray(fleet.api_ship))
          return []
        // make sure the fleet has ships
        const shipIds = fleet.api_ship.filter(rid => rid > 0)
        return shipIds.length > 0 ? [shipIds] : []
      }
    )

    return _.flatMap(
      fleetShipIds,
      shipIds => {
        const flagship = getShipDetailS0(shipIds[0])
        // flagship must be of type AR
        if (!flagship || flagship.stype !== 19)
          return []
        const capability = 2 +
          flagship.equipIds.filter(mstId => mstId === 86).length
        return _.take(shipIds,capability)
      }
    )
  }
)

const expedShipIdsSelector = createSelector(
  fleetsSelector,
  fleets => {
    if (!Array.isArray(fleets))
      return []
    return _.flatMap(
      fleets,
      fleet => {
        if (!('api_mission' in fleet) || !Array.isArray(fleet.api_mission))
          return []
        if (fleet.api_mission[0] === 0)
          return []
        return fleet.api_ship.filter(rId => rId > 0)
      }
    )
  }
)

const getShipDetailFuncSelector = createSelector(
  getShipDetailFuncSelectorS0,
  anchorageCoverageSelector,
  expedShipIdsSelector,
  fleetShipIdsSelector,
  (getShipDetailS0, ac, es, fleetShipIds) => _.memoize(
    rstId => {
      const info = getShipDetailS0(rstId)
      if (_.isEmpty(info))
        return null

      const fleetPair =
        _.toPairs(fleetShipIds).find(([_k, ids]) =>
          ids.includes(rstId))

      const fleetId = fleetPair ? Number(fleetPair[0]) : null
      const retObj = {
        ...info,
        fleetId,
        anchorage:
          ['normal','shouha'].includes(info.healthState) &&
          ac.includes(rstId),
        expedition: es.includes(rstId),
      }

      retObj.available =
        !info.docking.ongoing &&
        !retObj.expedition
      return retObj
    }
  )
)

const nfShipDetailListSelector = createSelector(
  nfShipIdListSelector,
  getShipDetailFuncSelector,
  (rstIds, getShipDetail) =>
    _.compact(rstIds.map(getShipDetail))
)

/*
   kind of an awkward name, just nfShipDetailListSelector with healthFilter
   taking into account.
 */
const nfShipDetailListWithHealthSelector = createSelector(
  nfShipDetailListSelector,
  healthFilterSelector,
  (xs, healthFilter) => {
    /* eslint-disable indent */
    const pred =
      healthFilter === 'all' ? (() => true) :
      healthFilter === 'lt-chuuha' ? (s => ['normal','shouha'].includes(s.healthState)) :
      healthFilter === 'gt-shouha' ? (s => !['normal','shouha'].includes(s.healthState)) :
      (console.error(`invalid healthFilter: ${healthFilter}`), () => true)
    /* eslint-enable indent */
    return xs.filter(pred)
  }
)

const sortedNfShipDetailListSelector = createSelector(
  nfShipDetailListWithHealthSelector,
  sortSelector,
  (xs, sort) =>
    sortToFunc(sort)(xs)
)

const totalResourceCostSelector = createSelector(
  sortedNfShipDetailListSelector,
  nfShipDetails => {
    // only select non-docking ships
    const details = nfShipDetails.filter(d => !d.docking.ongoing)
    const resourcePlus = (acc,x) => ({
      fuel: acc.fuel + x.docking.resource.fuel,
      steel: acc.steel + x.docking.resource.steel,
    })
    return details.reduce(resourcePlus, {fuel: 0, steel: 0})
  }
)

export * from './common'

export {
  sortedNfShipDetailListSelector,
  anchorageCoverageSelector,
  totalResourceCostSelector,
}
