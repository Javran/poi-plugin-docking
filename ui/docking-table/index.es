import _ from 'lodash'
import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  Table,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

import {
  sortSelector,
  simpleSelector,
  sortedNfShipDetailListSelector,
} from '../../selectors'
import { PTyp } from '../../ptyp'
import { mapDispatchToProps } from '../../store'
import { sortToDir } from '../../sorter'
import { __ } from '../../tr'
import { ShipRow } from './ship-row'

class DockingTableImpl extends PureComponent {
  static propTypes = {
    shipList: PTyp.array.isRequired,
    sort: PTyp.object.isRequired,
    simple: PTyp.bool.isRequired,
    sortToggle: PTyp.func.isRequired,
  }

  handleToggleSortMethod = method => () =>
    this.props.sortToggle(method)

  renderHeader = (method, title) => {
    const {sort} = this.props
    const isCurrent = method === sort.method
    const titleComponent = (
      <span>
        {title}
      </span>
    )
    return (
      <div
        className={isCurrent ? 'text-primary' : ''}
        style={{display: 'flex', alignItems: 'baseline'}}
        onClick={this.handleToggleSortMethod(method)}>
        {titleComponent}
        {
          isCurrent && method !== 'level' && (
            <FontAwesome
              style={{marginLeft: '.2em'}}
              name={sortToDir(sort) === 'asc' ? 'sort-asc' : 'sort-desc'}
            />
          )
        }
      </div>
    )
  }

  render() {
    const {shipList, simple} = this.props
    return (
      <Table
        className="docking-table"
        style={{tableLayout: 'fixed'}}
        striped bordered condensed hover>
        <thead>
          <tr>
            {
              !simple && (
                <td
                  style={{
                    width: '3em',
                  }}
                >
                  {this.renderHeader('rid','Id')}
                </td>
              )
            }
            {
              !simple && (
                <td
                  style={{
                    width: '4.2em',
                  }}
                >
                  {this.renderHeader('type',__('Headers.Type'))}
                </td>
              )
            }
            <td>
              {this.renderHeader('name',__('Headers.Name'))}
            </td>
            {
              !simple && (
                <td
                  style={{
                    width: '2.2em',
                  }}
                >
                  {this.renderHeader('level','Lv.')}
                </td>
              )
            }
            <td
              style={{
                width: simple ? '25%' : '4.5em',
                textAlign: 'center',
              }}
            >
              {this.renderHeader('hp-rate', 'HP')}
            </td>
            <td
              style={{
                width: simple ? '30%' : '4.5em',
                textAlign: 'center',
              }}
            >
              {this.renderHeader('dtime', __('Headers.Time'))}
            </td>
            {
              !simple && (
                <td
                  style={{
                    width: '4.2em',
                    textAlign: 'center',
                  }}
                >
                  {this.renderHeader('per-hp','/HP')}
                </td>
              )
            }
          </tr>
        </thead>
        <tbody>
          {
            // IIFE
            (() => {
              // break the list into chunks of 10
              const chunks = _.chunk(shipList,10)

              // interleave with separators
              return _.flatMap(
                chunks,
                (ships,ind) => {
                  const shipComponents = ships.map(s => (
                    <ShipRow
                      simple={simple}
                      ship={s}
                      key={s.rstId}
                    />
                  ))

                  // adding separator only if the current chunk
                  // is not the last one
                  if (ind+1 !== chunks.length) {
                    shipComponents.push(
                      <tr key={`sep-${ind}`} >
                        <td
                          colSpan={simple ? 3 : 7}
                          style={{
                            height: '.4em',
                            padding: 0,
                          }}
                        />
                      </tr>
                    )
                  }

                  return shipComponents
                }
              )
            })()
          }
        </tbody>
      </Table>
    )
  }
}

const DockingTable = connect(
  createStructuredSelector({
    shipList: sortedNfShipDetailListSelector,
    sort: sortSelector,
    simple: simpleSelector,
  }),
  mapDispatchToProps,
)(DockingTableImpl)

export {
  DockingTable,
}
