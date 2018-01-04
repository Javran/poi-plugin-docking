import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { RepairCostPanel } from './repair-cost-panel'
import { sortedNfShipDetailListSelector } from '../selectors'
import { PTyp } from '../ptyp'

class InfoPanelImpl extends PureComponent {
  static propTypes = {
    shipCount: PTyp.number.isRequired,
  }

  render() {
    const {shipCount} = this.props
    return (
      <div
        style={{
          display: 'flex',
        }}>
        <RepairCostPanel />
        <div style={{marginLeft: '1em'}}>
          <span>Count: {shipCount}</span>
        </div>
      </div>
    )
  }
}

const InfoPanel = connect(
  state => {
    const shipCount = sortedNfShipDetailListSelector(state).length
    return {shipCount}
  }
)(InfoPanelImpl)

export { InfoPanel }
