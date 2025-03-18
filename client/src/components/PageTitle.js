import React from 'react'
import { CFooter } from '@coreui/react'
import { AlternateEmailRounded } from '@mui/icons-material'
const PageTitle = ({ pageTitle }) => {
  return <h4>{pageTitle}</h4>
}

export default React.memo(PageTitle)
