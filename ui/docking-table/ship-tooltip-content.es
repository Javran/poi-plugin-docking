import React, { PureComponent } from 'react'
import { PTyp } from '../../ptyp'

class ShipTooltipContent extends PureComponent {
  static propTypes = {
    ship: PTyp.object.isRequired,
  }

  render() {
    const {ship} = this.props
    return (
      <div>
        <div style={{display: 'flex'}}>
          <span>
            {ship.typeName}
          </span>
          <span>
            {ship.name}
          </span>
          <span>
            {`Lv. ${ship.level}`}
          </span>
        </div>
        <div>
          <div>
            <span>HP</span>
            <span>{`${ship.hp.now}/${ship.hp.max}`}</span>
          </div>
          <div>
            <span>Time</span>
            <span>{ship.docking.time}</span>
          </div>
          <div>
            <span>Time per HP</span>
            <span>{ship.docking.herHp}</span>
          </div>
        </div>
      </div>
    )
  }
}

export { ShipTooltipContent }
