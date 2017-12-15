import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  ButtonToolbar,
  Button,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { modifyObject, not } from 'subtender'

import { PTyp } from '../ptyp'
import { mapDispatchToProps } from '../store'
import { hideUnlockedSelector, sortSelector } from '../selectors'
import { sortMethods, sortDescribe } from '../sorter'
import { __ } from '../tr'

class ControlPanelImpl extends PureComponent {
  static propTypes = {
    hideUnlocked: PTyp.bool.isRequired,
    sort: PTyp.object.isRequired,
    modify: PTyp.func.isRequired,
    sortToggle: PTyp.func.isRequired,
  }

  handleToggleSimple = () =>
    this.props.modify(modifyObject('hideUnlocked', not))

  render() {
    const {hideUnlocked, sort, sortToggle} = this.props
    const sortDesc = sortDescribe(sort,__)
    return (
      <ButtonToolbar style={{marginBottom: 8}}>
        <Button
          onClick={this.handleToggleSimple}
          style={{
            marginTop: 0,
            display: 'flex', alignItems: 'baseline',
          }}>
          <FontAwesome
            style={{width: '1em', height: '1em'}}
            name={hideUnlocked ? 'check-square-o' : 'square-o'} />
          <span style={{flex: 1, marginLeft: '.5em'}}>{__('HideUnlockedShips')}</span>
        </Button>
        <DropdownButton
          onSelect={sortToggle}
          style={{marginTop: 0}}
          title={__('SortBy',sortDesc)}
          id="plugin-docking-ctrl-sort">
          {
            sortMethods.map(name => {
              const isCurrent = name === sort.method
              return (
                <MenuItem
                  key={name} eventKey={name}>
                  {isCurrent ? sortDesc : __(`SorterDesc.${name}`)}
                </MenuItem>
              )
            })
          }
        </DropdownButton>
      </ButtonToolbar>
    )
  }
}

const ControlPanel = connect(
  createStructuredSelector({
    hideUnlocked: hideUnlockedSelector,
    sort: sortSelector,
  }),
  mapDispatchToProps,
)(ControlPanelImpl)

export { ControlPanel }
