import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { HoverMenu, Button, Bulb, EditorActionPaneLayout } from '../../index.js'
import { FullWidth, Right } from '../../index.js'
import { compactJSON, formatJSON } from '../../../utils'
import CodeMirror from './CodeMirror'

import axios from 'axios'
import { message } from 'antd'
import 'antd/dist/antd.css'

export default class MainEditor extends Component {
  propTypes = {
    code: PropTypes.string.isRequired,
    onChangeCode: PropTypes.func.isRequired
  }

  onClear = e => {
    this.props.onChangeCode('')
  }

  _onSpace = n => _ => {
    const { code } = this.props

    this.props.onChangeCode(formatJSON(code, n))
  }

  onSpace = {
    2: this._onSpace(2),
    3: this._onSpace(3),
    4: this._onSpace(4)
  }

  onCompact = _ => {
    const { code } = this.props

    this.props.onChangeCode(compactJSON(code))
  }

  changeConfig = _ => {
    const { code } = this.props
    const { isCodeValidJSON } = this.props
    const { archive_id } = this.props
    const { config } = this.props

    if(isCodeValidJSON) {
      const hide = message.loading('in progress..', 0)

      axios.patch(config.url+'/'+config.route+'/'+archive_id,
        {
          'data': JSON.parse(code)
        }
      ).then(result => {
        //alert("Sucesso!")
        setTimeout(hide, 50)
        message.success('Changes made successfully!')
      }).catch(error => {
        //alert(error)
        setTimeout(hide, 50)
        message.error('Error to send!',1)
      })
    }
    else {
      message.error('Invalid JSON!')
    }
  }

  render () {
    const { code, name_file, archive_id, onChangeCode, isCodeValidJSON, config } = this.props
    const { onSpace, onCompact, onClear, changeConfig } = this

    return (
      <EditorActionPaneLayout
        title={
          <FullWidth>
            <h3 style={{color: '#FFFF'}}>
              <span>{name_file}</span>
              <Bulb
                inline
                color={isCodeValidJSON ? 'lightgreen' : 'red'}
              />
            </h3>
            <Right>
              <Button onClick={changeConfig}>Apply changes</Button>
              <HoverMenu target={<Button onClick={onSpace['2']}>Format</Button>}>
                <Button onClick={onSpace['2']} key='2'>2 Spaces</Button>
                <Button onClick={onSpace['3']} key='3'>3 Spaces</Button>
                <Button onClick={onSpace['4']} key='4'>4 Spaces</Button>
              </HoverMenu>
              <Button onClick={onCompact}>Compact</Button>
              <Button onClick={onClear}>Clear</Button>
            </Right>
          </FullWidth>
        }
        main={
          <CodeMirror
            value={code}
            onValueChange={(editor, metadata, value) => onChangeCode(value)}
            innerRef={this.editorRefCallback}
            options={{
              tabSize: 4,
              mode: 'application/ld+json',
              lineNumbers: true,
              gutters: ['CodeMirror-lint-markers'],
              lint: true,
              theme: 'railscasts'
            }}
          />
        }
      />
    )
  }
}
