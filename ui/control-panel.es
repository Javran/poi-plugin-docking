import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  ButtonToolbar,
} from 'react-bootstrap'

import {
  ButtonGroup,
  Button,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core'

import FontAwesome from 'react-fontawesome'
import { modifyObject, not } from 'subtender'

import { Popover } from 'views/components/etc/overlay'

import { PTyp } from '../ptyp'
import { mapDispatchToProps } from '../store'
import {
  hideUnlockedSelector,
  sortSelector,
  healthFilterSelector,
} from '../selectors'
import { sortMethods, sortDescribe } from '../sorter'
import { __ } from '../tr'

class ControlPanelImpl extends PureComponent {
  static propTypes = {
    hideUnlocked: PTyp.bool.isRequired,
    healthFilter: PTyp.string.isRequired,
    sort: PTyp.object.isRequired,
    modify: PTyp.func.isRequired,
    sortToggle: PTyp.func.isRequired,
  }

  handleToggleSimple = () =>
    this.props.modify(modifyObject('hideUnlocked', not))

  handleToNextHealthFilter = () =>
    this.props.modify(modifyObject('healthFilter', hf =>
      /* eslint-disable indent */
      hf === 'all' ? 'lt-chuuha' :
      hf === 'lt-chuuha' ? 'gt-shouha' :
      hf === 'gt-shouha' ? 'all' :
      /* this case shouldn't happen, but we give it default value */ 'all'
      /* eslint-enable indent */
    ))

  render() {
    const {hideUnlocked, sort, sortToggle, healthFilter} = this.props
    const sortDesc = sortDescribe(sort,__)

    const menuContent = (
      <Menu>
        {
          sortMethods.map(name => {
            const isCurrent = name === sort.method
            return (
              <MenuItem
                key={name}
                text={isCurrent ? sortDesc : __(`SorterDesc.${name}`)}
                onClick={() => sortToggle(name)}
              />
            )
          })
        }
      </Menu>
    )

    return (
      <ButtonToolbar
        style={{
          marginBottom: 8,
          display: 'flex',
          flexWrap: 'wrap',
        }}>
        <Button
          onClick={this.handleToggleSimple}
          style={{
            marginTop: 0,
            marginBottom: 4,
            display: 'flex', alignItems: 'baseline',
          }}>
          <FontAwesome
            style={{width: '1em', height: '1em'}}
            name={hideUnlocked ? 'check-square-o' : 'square-o'} />
          <span style={{flex: 1, marginLeft: '.5em'}}>{__('HideUnlockedShips')}</span>
        </Button>
        <Button
          onClick={this.handleToNextHealthFilter}
          style={{
            width: '10em',
            marginTop: 0,
            marginBottom: 4,
            padding: 0,
          }}
        >
          {
            (() => {
              const headerText = __(`HealthFilter.Header`)
              const valueText = __(`HealthFilter.${healthFilter}`)
              return `${headerText}: ${valueText}`
            })()
          }
        </Button>
        <Popover
          content={menuContent}
          position={Position.BOTTOM}
        >
          <Button>
            {__('SortBy',sortDesc)}
          </Button>
        </Popover>
      </ButtonToolbar>
    )
  }
}

const ControlPanel = connect(
  createStructuredSelector({
    hideUnlocked: hideUnlockedSelector,
    healthFilter: healthFilterSelector,
    sort: sortSelector,
  }),
  mapDispatchToProps,
)(ControlPanelImpl)

export { ControlPanel }
