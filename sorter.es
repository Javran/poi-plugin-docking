const sortMethods = []
const sorters = {}

const defineSorter = (name, desc, getter=null, ascending=true) => {
  sorters[name] = {name, desc, getter, ascending}
  sortMethods.push(name)
}

defineSorter('rid', 'Id')
defineSorter('type', 'Type')
defineSorter('name', 'Name')
defineSorter('level', 'Level', undefined, false)
defineSorter('hp-rate', 'HP')
defineSorter('dtime', 'Docking Time', undefined, false)
defineSorter('perhp', 'Time per HP', undefined, false)

const sortToDir = ({method, reverse}) => {
  const info = sorters[method]
  return info.ascending ?
    (reverse ? 'desc' : 'asc') :
    (reverse ? 'asc' : 'desc')
}

const sortDescribe = sort => {
  const sortInfo = sorters[sort.method]
  return `${sortInfo.desc} ${sortToDir(sort) === 'asc' ? '↑' : '↓'}`
}

export {
  sorters,
  sortToDir,
  sortDescribe,
  sortMethods,
}
