import { ensureDirSync, readJsonSync, writeJsonSync } from 'fs-extra'
import { join } from 'path-extra'

const latestVersion = '0.3.0'

const stateToPState = ({simple, sort, hideUnlocked}) => ({
  $dataVersion: latestVersion,
  simple, sort, hideUnlocked,
})

const getPStateFilePath = () => {
  const {APPDATA_PATH} = window
  const path = join(APPDATA_PATH,'docking')
  ensureDirSync(path)
  return join(path,`p-state.json`)
}

const savePState = pState => {
  const path = getPStateFilePath()
  try {
    writeJsonSync(path,pState)
  } catch (err) {
    console.error('Error while writing to p-state file', err)
  }
}

const updatePState = oldPState => {
  if (oldPState.$dataVersion === latestVersion)
    return oldPState

  let newPState = oldPState
  if (newPState.$dataVersion === '0.0.1') {
    // 0.0.1 => 0.3.0
    newPState = {
      ...newPState,
      $dataVersion: '0.3.0',
      // new: whether we should hide unlocked ships
      hideUnlocked: false,
    }
  }

  if (newPState.$dataVersion === latestVersion) {
    setTimeout(() => savePState(newPState))
    return newPState
  }

  throw new Error('failed to update the config')
}

const loadPState = () => {
  try {
    return updatePState(readJsonSync(getPStateFilePath()))
  } catch (err) {
    if (err.syscall !== 'open' || err.code !== 'ENOENT') {
      console.error('Error while loading config', err)
    }
  }
  return null
}

export {
  stateToPState,
  savePState,
  loadPState,
}
