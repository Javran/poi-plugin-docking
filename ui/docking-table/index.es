import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Table } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import { SlotitemIcon } from 'views/components/etc/icon'

import { nfShipDetailListSelector } from '../../selectors'
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

class DockingTableImpl extends PureComponent {
  static propTypes = {
    shipList: PTyp.array.isRequired,
  }

  render() {
    const {shipList} = this.props
    const cellStyle = {
      verticalAlign: 'middle',
      padding: '5px .5em',
    }
    return (
      <Table
        className="docking-table"
        style={{tableLayout: 'fixed'}}
        striped bordered condensed hover>
        <thead>
          <tr>
            <td
              style={{
                width: '3em',
              }}
            >Id
            </td>
            <td
              style={{
                width: '4.2em',
              }}
            >
              Type
            </td>
            <td>Name</td>
            <td
              style={{
                width: '2.2em',
              }}
            >
              Lv.
            </td>
            <td
              style={{
                width: '4.5em',
                textAlign: 'center',
              }}
            >
              HP
            </td>
            <td
              style={{
                width: '4.5em',
                textAlign: 'center',
              }}
            >
              Time
            </td>
            <td
              style={{
                width: '4.2em',
                textAlign: 'center',
              }}
            >
              T/HP
            </td>
          </tr>
        </thead>
        <tbody>
          {
            shipList.map(s => {
              const timeDesc = pprTime(s.docking.time)
              const perHpDesc = pprTimeCompact(s.docking.perHp*1000)
              const perHpBold = s.docking.perHp >= 60*20
              return (
                <tr key={s.rstId}>
                  <td
                    style={{
                      ...cellStyle,
                      fontSize: '80%',
                    }}
                  >
                    {s.rstId}
                  </td>
                  <td
                    style={{
                      ...cellStyle,
                      fontSize: '80%',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {s.typeName}
                  </td>
                  <td
                    style={{
                      ...cellStyle,
                    }}
                  >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <span style={{
                        flex: 1,
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}>
                        {s.name}
                      </span>
                      {
                        /*
                           mutual exclusive icons for indicating situations
                           related to repairing:

                           - "bath" icon: the ship in question is docking
                           - "compass" icon: cannot dock the ship
                           due to an ongoing expedition
                           - "repair facility" icon: the ship is being anchorage-repaired

                         */
                        s.docking.ongoing ? (
                          <FontAwesome
                            className="icon"
                            name="bath"
                          />
                        ) : s.expedition ? (
                          <FontAwesome
                            className="icon"
                            name="compass"
                          />
                        ) : s.anchorage ? (
                          <SlotitemIcon
                            className="slotitem-img icon"
                            slotitemId={26}
                          />
                        ) : false
                      }
                      {
                        !s.lock && (
                          <FontAwesome
                            className="icon"
                            style={{marginLeft: '.2em'}}
                            name="unlock"
                          />
                        )
                      }
                    </div>
                  </td>
                  <td
                    style={{
                      ...cellStyle,
                      textAlign: 'center',
                      fontSize: '80%',
                    }}
                  >
                    {s.level}
                  </td>
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
                          color: colors[s.healthState],
                        }}
                      >
                        {s.hp.now}
                      </span>
                      <span
                        className="text-muted"
                        style={{
                          fontSize: '70%',
                          marginRight: '.5em',
                        }}
                      >
                        {`/${s.hp.max}`}
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
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    )
  }
}

const DockingTable = connect(
  createStructuredSelector({
    shipList: nfShipDetailListSelector,
  })
)(DockingTableImpl)

export {
  DockingTable,
}
