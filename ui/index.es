import { join } from 'path-extra'
import React from 'react'

import { DockingTable } from './docking-table'
import { InfoPanel } from './info-panel'
import { ControlPanel } from './control-panel'

const DockingMain = _props => (
  <div
    style={{margin: 8}}
  >
    <link
      rel="stylesheet"
      href={join(__dirname, '..', 'assets', 'docking.css')}
    />
    <ControlPanel />
    <InfoPanel />
    <DockingTable />
  </div>
)

export {
  DockingMain,
}
