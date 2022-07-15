import React from 'react'
import Wrapper from './Wrapper'
import Halver from './Halver'

export default ({ editor }) => (
  <Wrapper>
    <Halver>
      {editor}
    </Halver>
  </Wrapper>
)
