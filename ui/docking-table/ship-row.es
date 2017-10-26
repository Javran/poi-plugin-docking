import { join } from 'path-extra'
import React, { PureComponent } from 'react'
import _ from 'lodash'
import FontAwesome from 'react-fontawesome'
import {
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'

import { SlotitemIcon } from 'views/components/etc/icon'
import { PTyp } from '../../ptyp'
import {
  pprTime, pprTimeCompact,
  ShipTooltipContent,
} from './ship-tooltip-content'

const colors = {
  full: '#4CAF50',
  normal: '#4CAF50',
  shouha: '#FBC02D',
  chuuha: '#F57C00',
  taiha: '#D50000',
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
    const content = (
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
                  style={{marginLeft: '.2em'}}
                  className="icon"
                  name="bath"
                />
              ) : ship.expedition ? (
                <FontAwesome
                  style={{marginLeft: '.2em'}}
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

    return (
      <OverlayTrigger
        placement="bottom"
        overlay={(
          <Tooltip
            className="plugin-docking-pop"
            id={`docking-ship-tooltip-ship-${ship.rstId}`}>
            <ShipTooltipContent
              ship={ship}
            />
          </Tooltip>
        )}
      >
        {content}
      </OverlayTrigger>
    )
  }
}

export { ShipRow }
