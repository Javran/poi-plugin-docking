import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { MaterialIcon } from 'views/components/etc/icon'

import { PTyp } from '../ptyp'
import { totalResourceCostSelector } from '../selectors'

class RepairCostPanelImpl extends PureComponent {
  static propTypes = {
    fuel: PTyp.number.isRequired,
    steel: PTyp.number.isRequired,
  }

  render() {
    const {fuel, steel} = this.props
    return (
      <div
        className="repair-cost"
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <span>Repair Cost:</span>
        <MaterialIcon
          materialId={1}
          className="material-icon"
        />
        <span>{fuel}</span>
        <MaterialIcon
          materialId={3}
          className="material-icon"
        />
        <span>{steel}</span>
      </div>
    )
  }
}

const RepairCostPanel = connect(
  totalResourceCostSelector,
)(RepairCostPanelImpl)

export {
  RepairCostPanel,
}
