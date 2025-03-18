import React, { useState } from 'react'
import { CAvatar, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { cilAccountLogout, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import photo from './../../assets/images/avatars/user.png'
import { WholePageLoading } from '../SystemConfiguration'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [operationLoading, setOperationLoading] = useState(false)

  const handleLogout = async (e) => {
    e.preventDefault()

    setOperationLoading(true)
    setTimeout(() => {
      setOperationLoading(false)
      localStorage.removeItem('propertyPlantEquipmentToken')
      navigate('/login', { replace: true })
    }, 1000)
  }

  return (
    <>
      <CDropdown className="_avatar" variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 " caret={false}>
          <CAvatar
            src={photo}
            title="Profile Photo"
            size="md"
            alt="Profile Photo"
            style={{ width: '40px', height: '40px' }}
          />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem href="#/login" onClick={handleLogout}>
            <CIcon icon={cilAccountLogout} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      {operationLoading && <WholePageLoading />}
    </>
  )
}

export default AppHeaderDropdown
