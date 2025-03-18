import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Office = React.lazy(() => import('./views/office/Office'))
const AccountableOfficer = React.lazy(() =>
  import('./views/accountable_officer/AccountableOfficer'),
)
const PPE = React.lazy(() => import('./views/ppe/PPE'))
const Report = React.lazy(() => import('./views/report/Report'))
const MotorVehicle = React.lazy(() => import('./views/motor_vehicle/MotorVehicle'))
const User = React.lazy(() => import('./views/user/User'))
const EquipmentType = React.lazy(() => import('./views/equipment_type/EquipmentType'))

const routes = [
  {
    path: '/dashboard',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Dashboard',
    element: Dashboard,
  },
  {
    path: '/report',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Report',
    element: Report,
  },
  {
    path: '/ppe',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'PPE',
    element: PPE,
  },
  {
    path: '/motor_vehicle',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Motor Vehicle',
    element: MotorVehicle,
  },
  {
    path: '/accountable_officer',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Accountable Officer',
    element: AccountableOfficer,
  },
  {
    path: '/equipment_type',
    user: ['Super Admin', 'Admin'],
    exact: true,
    name: 'Equipment Type',
    element: EquipmentType,
  },
  {
    path: '/office',
    user: ['Super Admin'],
    exact: true,
    name: 'Office',
    element: Office,
  },
  { path: '/user', user: ['Super Admin'], name: 'User', element: User },
]

export default routes
