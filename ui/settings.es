import { createStructuredSelector } from 'reselect'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Checkbox } from 'react-bootstrap'
import { modifyObject, not } from 'subtender'

import {
  simpleSelector,
  readySelector,
} from '../selectors'
import { mapDispatchToProps } from '../store'
import { PTyp } from '../ptyp'

class SettingsImpl extends PureComponent {
  static propTypes = {
    readyFlag: PTyp.bool.isRequired,
    simple: PTyp.bool.isRequired,
    modify: PTyp.func.isRequired,
  }

  handleToggleSimpleMode = () =>
    this.props.modify(
      modifyObject('simple', not)
    )

  render() {
    const {readyFlag, simple} = this.props
    return (
      <div style={{marginBottom: '1.8em'}}>
        <div style={{display: 'flex', alignItems: 'baseline'}}>
          <div
            style={{
              width: '50%',
              maxWidth: '25em',
            }}
          >
            Simple Mode
          </div>
          <Checkbox
            style={{flex: 1}}
            onChange={this.handleToggleSimpleMode}
            disabled={!readyFlag}
            checked={simple}
          />
        </div>
      </div>
    )
  }
}

const Settings = connect(
  createStructuredSelector({
    readyFlag: readySelector,
    simple: simpleSelector,
  }),
  mapDispatchToProps,
)(SettingsImpl)

export { Settings }
