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
import { simpleSelector, sortSelector } from '../selectors'
import { sorters, sortMethods, sortDescribe } from '../sorter'

class ControlPanelImpl extends PureComponent {
  static propTypes = {
    simple: PTyp.bool.isRequired,
    sort: PTyp.object.isRequired,
    modify: PTyp.func.isRequired,
    sortToggle: PTyp.func.isRequired,
  }

  handleToggleSimple = () =>
    this.props.modify(modifyObject('simple', not))

  render() {
    const {simple, sort, sortToggle} = this.props
    const sortDesc = sortDescribe(sort)
    return (
      <ButtonToolbar style={{marginBottom: 8}}>
        <Button
          onClick={this.handleToggleSimple}
          style={{
            marginTop: 0,
            display: 'flex', alignItems: 'baseline',
            width: '8em',
          }}>
          <FontAwesome name={simple ? 'square-o' : 'check-square-o'} />
          <span style={{flex: 1, marginLeft: '.5em'}}>Simple</span>
        </Button>
        <DropdownButton
          onSelect={sortToggle}
          style={{marginTop: 0}}
          title={`Sort by ${sortDesc}`}
          id="plugin-docking-ctrl-sort">
          {
            sortMethods.map(name => {
              const sorter = sorters[name]
              const isCurrent = name === sort.method
              return (
                <MenuItem
                  key={name} eventKey={name}>
                  {isCurrent ? sortDesc : sorter.desc}
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
    simple: simpleSelector,
    sort: sortSelector,
  }),
  mapDispatchToProps,
)(ControlPanelImpl)

export { ControlPanel }
