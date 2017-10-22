import { join } from 'path-extra'
import React from 'react'

import { DockingTable } from './docking-table'
import { RepairCostPanel } from './repair-cost-panel'
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
    <RepairCostPanel />
    <DockingTable />
  </div>
)

export {
  DockingMain,
}
