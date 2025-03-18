import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibLetterboxd,
  cilBackspace,
  cilBuilding,
  cilBusAlt,
  cilCarAlt,
  cilCaretBottom,
  cilCaretTop,
  cilContrast,
  cilFile,
  cilPeople,
  cilShareBoxed,
  cilSpeedometer,
  cilUser,
  cilUserUnfollow,
  cilUserX,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = (userInfo) => {
  let items = []

  // Super Admin
  if (userInfo.role_type === 'Super Admin') {
    items = [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'PPE',
        to: '/ppe',
        icon: <CIcon icon={cilShareBoxed} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Accountable Officer',
        to: '/accountable_officer',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Office',
        to: '/office',
        icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Equipment Type',
        to: '/equipment_type',
        icon: <CIcon icon={cilCaretBottom} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Report',
        to: '/report',
        icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'User',
        to: '/user',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ]
  }
  // Admin

  if (userInfo.role_type === 'Admin') {
    items = [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'PPE',
        to: '/ppe',
        icon: <CIcon icon={cilShareBoxed} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Accountable Officer',
        to: '/accountable_officer',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Office',
        to: '/office',
        icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Report',
        to: '/report',
        icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Equipment Type',
        to: '/equipment_type',
        icon: <CIcon icon={cilCaretBottom} customClassName="nav-icon" />,
      },
    ]
  }
  return items
}

export default _nav
