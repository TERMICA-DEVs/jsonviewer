import React, { Component } from 'react'
import { MainLayout, EditorViewerLayout, MainEditor, MainViewer, JSONViewerPane } from './components'
import 'codemirror/lib/codemirror.css'
import './codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/lint.css'
import './lib/json-lint.js'

import { message } from 'antd'
import 'antd/dist/antd.css'
import axios from 'axios'

import { isJSON } from './utils'
import Config from './config.json'

class App extends Component {

  state = {
    code: `{}`,
    name_file: 'none',
    files: [],
    archive_id: 0,
    isCodeValidJSON: true,
    config: JSON.parse(JSON.stringify(Config))
  }

  loadData = () => {
    const hide = message.loading('in progress..', 0)

    return axios.get(
        this.state.config.url+'/'+this.state.config.route
      ).then(result => {
        //console.log(result.data);
        setTimeout(hide, 50)
        message.success('Successfully!',1)
        this.setState({
          code: JSON.stringify(result.data.data, null, '\t'),
          name_file: result.data.file_name,
          files: result.data.files
        })
      }).catch(error => {
        //alert(error)
        setTimeout(hide, 50)
        message.error('Error to load!',1)
      })
  }

  updateData = (id, config) => {
    const hide = message.loading('in progress..', 0)
    return axios.get(
        config.url+'/'+config.route+'/'+id
      ).then(result => {
        //console.log(result.data);
        setTimeout(hide, 50)
        message.success('Successfully!',1)
        this.setState({
          code: JSON.stringify(result.data.data, null, '\t'),
          name_file: result.data.file_name,
          archive_id: id,
          files: result.data.files
        })
      }).catch(error => {
        //alert(error)
        setTimeout(hide, 50)
        message.error('Error to load!',1)
      })
  }

  componentDidMount() {
    this.loadData()
  }

  onChangeCode = code => this.setState({ code, isCodeValidJSON: isJSON(code) })

  render () {
    const { state: { code, name_file, archive_id, files, isCodeValidJSON, config }, onChangeCode, updateData } = this
    return (
      <MainLayout
        main={
          <EditorViewerLayout
            editor={
              <MainEditor
                code={code}
                name_file={name_file}
                archive_id={archive_id}
                onChangeCode={onChangeCode}
                isCodeValidJSON={isCodeValidJSON}
                config={config}
              />
            }
          />
        }
        sidebar={<JSONViewerPane list={files} updateData={updateData} config={config}/>}
      />
    )
  }
}

export default App
