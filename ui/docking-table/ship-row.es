import { join } from 'path-extra'
import React, { PureComponent } from 'react'
import _ from 'lodash'
import FontAwesome from 'react-fontawesome'

import { SlotitemIcon } from 'views/components/etc/icon'
import { PTyp } from '../../ptyp'

const colors = {
  full: '#4CAF50',
  normal: '#4CAF50',
  shouha: '#FBC02D',
  chuuha: '#F57C00',
  taiha: '#D50000',
}

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

class ShipRow extends PureComponent {
  static propTypes = {
    ship: PTyp.object.isRequired,
    simple: PTyp.bool.isRequired,
  }

  render() {
    const cellStyle = {
      verticalAlign: 'middle',
      padding: '5px .5em',
    }
    const {ship, simple} = this.props
    const timeDesc = pprTime(ship.docking.time)
    const perHpDesc = pprTimeCompact(ship.docking.perHp*1000)
    const perHpBold = ship.docking.perHp >= 60*20
    return (
      <tr className={ship.available ? '' : 'text-muted'}>
        {
          !simple && (
            <td
              style={{
                ...cellStyle,
                fontSize: '80%',
              }}
            >
              {ship.rstId}
            </td>
          )
        }
        {
          !simple && (
            <td
              style={{
                ...cellStyle,
                fontSize: '80%',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {ship.typeName}
            </td>
          )
        }
        <td
          style={{
            ...cellStyle,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center'}}>
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
            {
              ship.fleetId && (
                <img
                  style={{height: '1.1em', marginLeft: '.2em'}}
                  alt={`/${ship.fleetId}`}
                  src={join(__dirname,'..','..','assets','images',`fleet-${ship.fleetId}.png`)}
                />
              )
            }
            {
              /*
                 mutual exclusive icons for indicating situations
                 related to repairing:

                 - "bath" icon: the ship in question is docking
                 - "compass" icon: cannot dock the ship
                 due to an ongoing expedition
                 - "repair facility" icon: the ship is being anchorage-repaired

               */
              ship.docking.ongoing ? (
                <FontAwesome
                  className="icon"
                  name="bath"
                />
              ) : ship.expedition ? (
                <FontAwesome
                  className="icon"
                  name="compass"
                />
              ) : ship.anchorage ? (
                <SlotitemIcon
                  className="slotitem-img icon"
                  slotitemId={26}
                />
              ) : false
            }
            {
              !ship.lock && (
                <FontAwesome
                  className="icon"
                  style={{marginLeft: '.2em'}}
                  name="unlock"
                />
              )
            }
          </div>
        </td>
        {
          !simple && (
            <td
              style={{
                ...cellStyle,
                textAlign: 'center',
                fontSize: '80%',
              }}
            >
              {ship.level}
            </td>
          )
        }
        <td
          style={{
            ...cellStyle,
            textAlign: 'center',
            padding: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            <span
              style={{
                flex: 1,
                fontSize: '110%',
                fontWeight: 'bold',
                textAlign: 'initial',
                marginLeft: '.5em',
                color: colors[ship.healthState],
              }}
            >
              {ship.hp.now}
            </span>
            <span
              className="text-muted"
              style={{
                fontSize: '70%',
                marginRight: '.5em',
              }}
            >
              {`/${ship.hp.max}`}
            </span>
          </div>
        </td>
        <td
          style={{
            ...cellStyle,
            fontSize: '90%',
            textAlign: 'center',
            padding: 0,
          }}
        >
          {timeDesc}
        </td>
        {
          !simple && (
            <td
              style={{
                ...cellStyle,
                fontSize: '90%',
                textAlign: 'center',
                padding: 0,
                ...(perHpBold ? {fontWeight: 'bold'} : {}),
              }}
            >
              {perHpDesc}
            </td>
          )
        }
      </tr>
    )
  }
}

export { ShipRow }
