import _ from 'lodash'
import {
  projectorToComparator,
  chainComparators,
  flipComparator,
} from 'subtender'

const sortMethods = []
const sorters = {}

const defineSorter = (name, desc, comparator='Comparator missing', ascending=true) => {
  sorters[name] = {name, desc, comparator, ascending}
  sortMethods.push(name)
}

const rosterIdComparator = projectorToComparator(x => x.rstId)

const inGameLevelComparator =
  chainComparators(
    flipComparator(projectorToComparator(x => x.level)),
    projectorToComparator(x => x.sortNo),
    rosterIdComparator)

const inGameShipTypeComparator =
  chainComparators(
    flipComparator(projectorToComparator(x => x.stype)),
    projectorToComparator(x => x.sortNo),
    flipComparator(projectorToComparator(x => x.level)),
    rosterIdComparator)

defineSorter('rid', 'Id', rosterIdComparator,)
defineSorter('type', 'Type', inGameShipTypeComparator)
defineSorter(
  'name', 'Name',
  chainComparators(
    projectorToComparator(x => x.name),
    rosterIdComparator
  )
)
defineSorter('level', 'Level', inGameLevelComparator, false)
defineSorter(
  'hp-rate', 'HP',
  chainComparators(
    projectorToComparator(x => x.hp.rate),
    rosterIdComparator
  )
)
defineSorter(
  'dtime', 'Docking Time',
  chainComparators(
    flipComparator(projectorToComparator(x => x.docking.time)),
    rosterIdComparator
  ),
  false
)
defineSorter(
  'per-hp', 'Time per HP',
  chainComparators(
    flipComparator(projectorToComparator(x => x.docking.perHp)),
    rosterIdComparator
  ),
  false
)

const sortToDir = ({method, reverse}) => {
  const info = sorters[method]
  return info.ascending ?
    (reverse ? 'desc' : 'asc') :
    (reverse ? 'asc' : 'desc')
}

const sortDescribe = (sort, __=null) => {
  const sortInfo = sorters[sort.method]
  const desc =
    typeof __ === 'function' ? __(`SorterDesc.${sort.method}`) : sortInfo.desc
  return `${desc} ${sortToDir(sort) === 'asc' ? '↑' : '↓'}`
}

const sortToFunc = ({method, reverse}) => {
  const info = sorters[method]
  const mayReverse = reverse ? xs => xs.reverse() : _.identity
  return _.flow(
    xs => xs.sort(info.comparator),
    mayReverse
  )
}

export {
  sorters,
  sortToDir,
  sortDescribe,
  sortMethods,
  sortToFunc,
}
