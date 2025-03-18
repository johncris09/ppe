import { CCard, CCardBody } from '@coreui/react'
import { jwtDecode } from 'jwt-decode'
import React from 'react'

function Dashboard() {
  const user = jwtDecode(localStorage.getItem('propertyPlantEquipmentToken'))

  return (
    <CCard>
      <CCardBody>
        <h5>Welcome {user.first_name},</h5>
      </CCardBody>
    </CCard>
  )
}

export default Dashboard
