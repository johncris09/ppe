import React from 'react'
import { CFooter } from '@coreui/react'
import { AlternateEmailRounded } from '@mui/icons-material'
import { currentYear } from './SystemConfiguration'
const AppFooter = () => {
  return (
    <CFooter>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://oroquietacity.net/" target="_blank" rel="noopener noreferrer">
          LGU Oroquieta City - MIS Division
        </a>
        <AlternateEmailRounded /> {currentYear}
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
