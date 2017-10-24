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
        <div
          style={{
            display: 'flex',
            width: '16em',
          }}>
          <span
            style={{
              width: '5em',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {ship.typeName}
          </span>
          <div style={{flex: 1, width: '7em', display: 'flex', alignItems: 'baseline'}}>
            <span
              style={{
                flex: 1,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {ship.name}
            </span>
            <span style={{fontSize: '70%'}}>{`(${ship.rstId})`}</span>
          </div>
          <span
            style={{
              fontSize: '80%',
              marginLeft: '.2em',
              width: '3.2em',
            }}>
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
