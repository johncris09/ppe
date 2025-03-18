import React, { useState } from 'react'
import './../../assets/css/react-paginate.css'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import UserProfile from './UserProfile'
import ChangePassword from './ChangePassword'
import { toast } from 'react-toastify'

const User = ({ cardTitle }) => {
  const [activeKey, setActiveKey] = useState(1)

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>{cardTitle}</CCardHeader>
        <CCardBody>
          <CNav variant="pills" layout="justified">
            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 1}
                component="button"
                role="tab"
                aria-controls="profile-tab"
                aria-selected={activeKey === 1}
                onClick={() => {
                  setActiveKey(1)
                  toast.dismiss()
                }}
              >
                User Profile
              </CNavLink>
            </CNavItem>
            <CNavItem role="presentation">
              <CNavLink
                active={activeKey === 2}
                component="button"
                role="tab"
                aria-controls="change-password"
                aria-selected={activeKey === 2}
                onClick={() => {
                  setActiveKey(2)
                  toast.dismiss()
                }}
              >
                Change Password
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane
              role="tabpanel"
              aria-labelledby="profile-tab"
              visible={activeKey === 1}
              style={{ position: 'relative' }}
            >
              <hr />
              <UserProfile />
            </CTabPane>
            <CTabPane
              role="tabpanel"
              aria-labelledby="change-password"
              visible={activeKey === 2}
              style={{ position: 'relative' }}
            >
              <hr />
              <ChangePassword />
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </>
  )
}

export default User
