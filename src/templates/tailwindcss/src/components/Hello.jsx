import React from 'react'

import Logo from '@images/github-logo.png'
import LogoWebp from '@images/github-logo.png?format=webp'

const Hello = () => (
  <div>
    <h1>Hello World</h1>
    <picture>
      <source type="image/webp" srcSet={LogoWebp} />
      <source type="image/jpeg" srcSet={Logo} />
      <img src={Logo} alt="" />
    </picture>
  </div>
)

export default Hello
