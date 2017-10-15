import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  shipsSelector,
  constSelector,
  repairsSelector,
  fleetsSelector,
  equipsSelector,
} from 'views/utils/selectors'

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

/*
   a list of ships that need docking, NF for non-full HP.
   ship's ordering is unspecified.
 */
const nfShipIdListSelector = createSelector(
  shipsSelector,
  sObj =>
    Object.values(sObj)
      .filter(s => s.api_ndock_time !== 0)
      .map(s => s.api_id)
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
  (ships, equips, {$ships,$shipTypes}, dockingShipIds) => _.memoize(
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
          eRid => eRid > 0
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

const getShipDetailFuncSelector = createSelector(
  getShipDetailFuncSelectorS0,
  anchorageCoverageSelector,
  (getShipDetailS0, ac) => _.memoize(
    rstId => {
      const info = getShipDetailS0(rstId)
      if (_.isEmpty(info))
        return null

      return {...info, anchorage: ac.includes(rstId)}
    }
  )
)

const nfShipDetailListSelector = createSelector(
  nfShipIdListSelector,
  getShipDetailFuncSelector,
  (rstIds, getShipDetail) =>
    _.compact(rstIds.map(getShipDetail))
)

export {
  nfShipDetailListSelector,
  anchorageCoverageSelector,
}
