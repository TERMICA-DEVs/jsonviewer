import React from 'react'
import 'antd/dist/antd.css'
import { Tree } from 'antd'

function ListArchives({list, updateData, config}) {

  const { DirectoryTree } = Tree

  const children = list.map(function(arquive, index) {
      return (
      {
        title: arquive,
        key: index,
        isLeaf: true,
      })
    }
  )

  const treeData = [
    {
      title: 'files',
      key: '0-0',
      children: children
    }
  ]

  const onSelect = (keys, info) => {
    console.log('Trigger Select', keys, info)
    updateData(keys, config)
  }

  const onExpand = (keys, info) => {
    console.log('Trigger Expand', keys, info)
  }

  return (
    <DirectoryTree
      multiple
      defaultExpandAll
      onSelect={onSelect}
      onExpand={onExpand}
      treeData={treeData}
      style={{color: '#FFFF', backgroundColor: '#393838', padding:'20px'}}
    />
  )
}

export default ListArchives
