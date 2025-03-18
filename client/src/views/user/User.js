import React, { useState, useRef } from 'react'
import Swal from 'sweetalert2'
import 'cropperjs/dist/cropper.css'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
  CInputGroup,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp, Key } from '@mui/icons-material'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
  roleType,
  toSentenceCase,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PageTitle from 'src/components/PageTitle'

const User = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const selectRoleTypeInputRef = useRef()
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [modalChangePasswordFormVisible, setModalChangePasswordFormVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [togglePassword, setTogglePassword] = useState(true)
  const column = [
    {
      accessorKey: 'first_name',
      header: 'First Name',
    },

    {
      accessorKey: 'middle_name',
      header: 'Middle Name',
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
    },
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'role_type',
      header: 'Role Type',
    },
  ]

  const user = useQuery({
    queryFn: async () =>
      await api.get('user').then((response) => {
        return response.data
      }),
    queryKey: ['user'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    username: Yup.string().required('Username is required'),
    role_type: Yup.string().required('Role Type is required'),
    password: Yup.string().when('hidePassword', {
      is: false,
      then: (schema) =>
        schema
          .required('Password is required')
          .min(7, 'Too Short!')
          .max(16, 'Too Long!')
          .matches(
            /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
            'Password must have at least 1 uppercase letter, 1 symbol, and be at least 8 characters',
          ),
      otherwise: (schema) => schema,
    }),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      username: '',
      password: '',
      hidePassword: false,
      role_type: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.hidePassword) {
        await updateUser.mutate(values)
      } else {
        await insertUser.mutate(values)
      }
    },
  })

  const insertUser = useMutation({
    mutationFn: async (user) => {
      return await api.post('user/insert', user)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries(['user'])
    },
    onError: (error) => {
      toast.error('Duplicate Entry!')
    },
  })
  const updateUser = useMutation({
    mutationFn: async (user) => {
      return await api.put('user/update/' + user.id, user)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries(['user'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updatePasswordFormValidationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(7, 'Too Short!')
      .max(12, 'Too Long!')
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
        'Password must have at least 1 uppercase letter, 1 symbol, and be at least 8 characters',
      ),
  })
  const updatePasswordForm = useFormik({
    initialValues: {
      id: '',
      password: '',
    },
    validationSchema: updatePasswordFormValidationSchema,
    onSubmit: async (values) => {
      await updatePassword.mutate(values)
    },
  })

  const updatePassword = useMutation({
    mutationFn: async (user) => {
      return await api.put('user/change_password/' + user.id, user)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      updatePasswordForm.resetForm()
      setModalChangePasswordFormVisible(false)
      await queryClient.invalidateQueries(['user'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value, type, checked } = e.target

    if (type === 'text' && name !== 'username' && name !== 'password') {
      form.setFieldValue(name, toSentenceCase(value))
    } else {
      form.setFieldValue(name, value)
    }
  }

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target
    updatePasswordForm.setFieldValue(name, value)
  }

  return (
    <>
      <ToastContainer />
      <PageTitle pageTitle={cardTitle} />
      <MaterialReactTable
        columns={column}
        data={!user.isLoading && user.data}
        state={{
          isLoading:
            user.isLoading ||
            insertUser.isPending ||
            updateUser.isPending ||
            updatePassword.isPending,
          isSaving:
            user.isLoading ||
            insertUser.isPending ||
            updateUser.isPending ||
            updatePassword.isPending,
          showLoadingOverlay:
            user.isLoading ||
            insertUser.isPending ||
            updateUser.isPending ||
            updatePassword.isPending,
          showProgressBars:
            user.isLoading ||
            insertUser.isPending ||
            updateUser.isPending ||
            updatePassword.isPending,
          showSkeletons:
            user.isLoading ||
            insertUser.isPending ||
            updateUser.isPending ||
            updatePassword.isPending,
        }}
        muiCircularProgressProps={{
          color: 'secondary',
          thickness: 5,
          size: 55,
        }}
        muiSkeletonProps={{
          animation: 'pulse',
          height: 28,
        }}
        columnFilterDisplayMode="popover"
        paginationDisplayMode="pages"
        positionToolbarAlertBanner="bottom"
        enableStickyHeader
        enableStickyFooter
        enableRowActions
        initialState={{
          density: 'compact',
          columnPinning: { left: ['mrt-row-actions'] },
        }}
        renderTopToolbarCustomActions={({ row, table }) => (
          <Box
            className="d-none d-lg-flex"
            sx={{
              display: 'flex',
              gap: '.2rem',
              p: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              size="medium"
              title="Add New"
              shape="rounded"
              style={{ fontSize: 20 }}
              onClick={() => {
                form.resetForm()
                setIsEnableEdit(false)

                setModalVisible(!modalFormVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Box>
        )}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
            <Tooltip title="Edit">
              <IconButton
                color="warning"
                onClick={() => {
                  form.setValues({
                    id: row.original.id,
                    last_name: row.original.last_name,
                    first_name: row.original.first_name,
                    middle_name: row.original.middle_name,
                    username: row.original.username,
                    role_type: row.original.role_type,
                    hidePassword: true,
                  })
                  setModalVisible(true)
                }}
              >
                <EditSharp />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => {
                  Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      validationPrompt(async () => {
                        let id = row.original.id

                        await api
                          .delete('user/delete/' + id)
                          .then(async (response) => {
                            await queryClient.invalidateQueries(['user'])

                            toast.success(response.data.message)
                          })
                          .catch((error) => {
                            console.info(error.response.data)
                            // toast.error(handleError(error))
                          })
                      })
                    }
                  })
                }}
              >
                <DeleteOutline />
              </IconButton>
            </Tooltip>
            <Tooltip title="Change Password">
              <IconButton
                color="secondary"
                onClick={() => {
                  setModalChangePasswordFormVisible(true)
                  updatePasswordForm.setValues({
                    id: row.original.id,
                    password: '',
                  })
                }}
              >
                <Key />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />

      <CModal
        alignment="center"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            {form.values.hidePassword ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm className="row g-3   mt-4" onSubmit={form.handleSubmit}>
            <CRow>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  label={requiredField('First Name')}
                  name="first_name"
                  onChange={handleInputChange}
                  value={form.values.first_name}
                  placeholder="First Name"
                  invalid={form.touched.first_name && form.errors.first_name}
                />
                {form.touched.first_name && form.errors.first_name && (
                  <CFormText className="text-danger">{form.errors.first_name}</CFormText>
                )}
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  label="Middle Initial"
                  name="middle_name"
                  onChange={handleInputChange}
                  value={form.values.middle_name}
                  placeholder="Middle Initial"
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  label={requiredField('Last Name')}
                  name="last_name"
                  onChange={handleInputChange}
                  value={form.values.last_name}
                  placeholder="Last Name"
                  invalid={form.touched.last_name && form.errors.last_name}
                />
                {form.touched.last_name && form.errors.last_name && (
                  <CFormText className="text-danger">{form.errors.last_name}</CFormText>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label={requiredField('Username')}
                  name="username"
                  onChange={handleInputChange}
                  value={form.values.username}
                  placeholder="Username"
                  invalid={form.touched.username && form.errors.username}
                />
                {form.touched.username && form.errors.username && (
                  <CFormText className="text-danger">{form.errors.username}</CFormText>
                )}
              </CCol>
              {!form.values.hidePassword && (
                <CCol md={6}>
                  <CFormLabel>{requiredField('Password')}</CFormLabel>
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type={togglePassword ? 'password' : 'text'}
                      name="password"
                      onChange={handleInputChange}
                      value={form.values.password}
                      placeholder="Password"
                      invalid={form.touched.password && form.errors.password}
                    />
                    <CButton
                      onClick={() => {
                        setTogglePassword((prevShowPassword) => !prevShowPassword)
                      }}
                      type="button"
                      color="secondary"
                      variant="outline"
                    >
                      <FontAwesomeIcon icon={togglePassword ? faEye : faEyeSlash} />
                    </CButton>
                  </CInputGroup>
                  {form.touched.password && form.errors.password && (
                    <CFormText className="text-danger">{form.errors.password}</CFormText>
                  )}
                </CCol>
              )}
              <CCol md={form.values.hidePassword ? 6 : 12}>
                <CFormLabel>{requiredField('Role Type')}</CFormLabel>
                <Select
                  ref={selectRoleTypeInputRef}
                  value={roleType.find((option) => option.value === form.values.role_type)}
                  onChange={handleSelectChange}
                  options={roleType}
                  name="role_type"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
                {form.touched.role_type && form.errors.role_type && (
                  <CFormText className="text-danger">{form.errors.role_type}</CFormText>
                )}
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  {form.values.hidePassword ? 'Update' : 'Submit'}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
          {(insertUser.isPending || updateUser.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>

      <CModal
        alignment="center"
        visible={modalChangePasswordFormVisible}
        onClose={() => setModalChangePasswordFormVisible(false)}
        backdrop="static"
        keyboard={false}
        size="md"
      >
        <CModalHeader>
          <CModalTitle>Change Password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm className="row g-3   mt-4" onSubmit={updatePasswordForm.handleSubmit}>
            <CCol md={12}>
              <CFormLabel>{requiredField('Password')}</CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput
                  type={togglePassword ? 'password' : 'text'}
                  name="password"
                  onChange={handlePasswordInputChange}
                  value={updatePasswordForm.values.password}
                  placeholder="Password"
                />
                <CButton
                  onClick={() => {
                    setTogglePassword((prevShowPassword) => !prevShowPassword)
                  }}
                  type="button"
                  color="secondary"
                  variant="outline"
                >
                  <FontAwesomeIcon icon={togglePassword ? faEye : faEyeSlash} />
                </CButton>
              </CInputGroup>
              {updatePasswordForm.touched.password && updatePasswordForm.errors.password && (
                <CFormText className="text-danger">{updatePasswordForm.errors.password}</CFormText>
              )}
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                Change Password
              </CButton>
            </CCol>
          </CForm>
          {updatePassword.isPending && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default User
