import _ from 'lodash'
import React, { PureComponent } from 'react'
import { ProgressBar } from 'react-bootstrap'
import {
  getHpStyle,
} from 'views/utils/game-utils'

import { PTyp } from '../../ptyp'
import { __ } from '../../tr'

const splitTime = ms => {
  let remained = Math.floor(ms/1000)
  const hour = Math.floor(remained/3600)
  remained -= hour*3600
  const minute = Math.floor(remained/60)
  remained -= minute*60
  const second = remained
  return [hour,minute,second]
}

const doPad = v => _.padStart(String(v),2,'0')

const pprTime = ms => {
  const [hour,minute,second] = splitTime(ms)
  return [hour,minute,second].map(doPad).join(':')
}

const pprTimeCompact = ms => {
  const nums = splitTime(ms)
  while (nums.length > 1 && nums[0] === 0)
    nums.shift()
  const [hd, ...tl] = nums
  return [hd, ...tl.map(doPad)].join(':')
}

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
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span style={{width: '30%'}}>HP</span>
          <ProgressBar
            style={{flex: 1, margin: 0}}
            min={0}
            max={ship.hp.max}
            now={ship.hp.now}
            bsStyle={getHpStyle(ship.hp.now / ship.hp.max * 100)}
          />
        </div>
        <div style={{display: 'flex'}}>
          <span style={{width: '30%'}}>{__('Tooltip.Time')}</span>
          <span style={{flex: 1}}>{pprTime(ship.docking.time)}</span>
        </div>
        <div style={{display: 'flex'}}>
          <span style={{width: '30%'}}>{__('Tooltip.PerHp')}</span>
          <span style={{flex: 1}}>{pprTime(ship.docking.perHp*1000)}</span>
        </div>
      </div>
    )
  }
}

export {
  pprTime,
  pprTimeCompact,
  ShipTooltipContent,
}
