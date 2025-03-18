import React, { useRef, useState } from 'react'
import Select from 'react-select'
import Swal from 'sweetalert2'
import 'cropperjs/dist/cropper.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PageTitle from 'src/components/PageTitle'
import { jwtDecode } from 'jwt-decode'
const AccountableOfficer = ({ cardTitle }) => {
  const user = jwtDecode(localStorage.getItem('propertyPlantEquipmentToken'))
  const officeInputRef = useRef()
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const column = [
    {
      accessorKey: 'last_name',
      header: 'Last Name',
    },
    {
      accessorKey: 'first_name',
      header: 'First Name',
    },
    {
      accessorKey: 'middle_name',
      header: 'Middle Name',
    },
    {
      accessorKey: 'suffix',
      header: 'Suffix',
    },
    {
      accessorKey: 'assumption_date',
      header: 'Assumption Date',
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'credentials',
      header: 'Credentials',
    },
    {
      accessorKey: 'abbr',
      header: 'Office',
    },
  ]

  const accountableOfficer = useQuery({
    queryFn: async () =>
      await api.get('accountable_officer').then((response) => {
        return response.data
      }),
    queryKey: ['accountableOfficer'],
    staleTime: Infinity,
  })

  const accountableOfficerOffice = useQuery({
    queryFn: async () =>
      await api.get('office').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.abbr} - ${item.office}`.trim()
          return { value, label }
        })

        return formattedData
      }),
    queryKey: ['accountableOfficerOffice'],
    staleTime: Infinity,
    // refetchInterval: 1000,
  })

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      suffix: '',
      assumption_date: '',
      designation: '',
      title: '',
      credentials: '',
      office: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateAccountableOfficer.mutate(values)
      } else {
        await insertAccountableOfficer.mutate(values)
      }
    },
  })

  const insertAccountableOfficer = useMutation({
    mutationFn: async (values) => {
      return await api.post('accountable_officer/insert', values)
    },
    onSuccess: async (response) => {
      console.info(response.data)
      if (response.data.status) {
        toast.success(response.data.message)
        form.resetForm()
        setModalVisible(false)
        await queryClient.invalidateQueries(['accountableOfficer'])
      } else {
        toast.error(response.data.message)
      }
    },

    onError: (error) => {
      console.info(error)
      Swal.fire({
        title: 'Error!',
        html: 'Internal Server Error',
        icon: 'error',
      })
    },
  })
  const updateAccountableOfficer = useMutation({
    mutationFn: async (values) => {
      return await api.put('accountable_officer/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      console.info(response.data)
      if (response.data.status) {
        toast.success(response.data.message)
        form.resetForm()
        setModalVisible(false)
        await queryClient.invalidateQueries(['accountableOfficer'])
      } else {
        toast.error(response.data.message)
      }
    },
    onError: (error) => {
      console.info(error.response.data)
      Swal.fire({
        title: 'Error!',
        html: 'Internal Server Error',
        icon: 'error',
      })
    },
  })

  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value } = e.target
    form.setFieldValue(name, value)
  }

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }
  return (
    <>
      <ToastContainer />
      <PageTitle pageTitle={cardTitle} />
      <CCard>
        <CCardHeader>
          {cardTitle}
          <div className="float-end">
            <CButton
              size="sm"
              onClick={() => {
                form.resetForm()

                setModalVisible(!modalVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add {cardTitle}
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={!accountableOfficer.isLoading && accountableOfficer.data}
            state={{
              isLoading:
                accountableOfficer.isLoading ||
                insertAccountableOfficer.isPending ||
                updateAccountableOfficer.isPending,
              isSaving:
                accountableOfficer.isLoading ||
                insertAccountableOfficer.isPending ||
                updateAccountableOfficer.isPending,
              showLoadingOverlay:
                accountableOfficer.isLoading ||
                insertAccountableOfficer.isPending ||
                updateAccountableOfficer.isPending,
              showProgressBars:
                accountableOfficer.isLoading ||
                insertAccountableOfficer.isPending ||
                updateAccountableOfficer.isPending,
              showSkeletons:
                accountableOfficer.isLoading ||
                insertAccountableOfficer.isPending ||
                updateAccountableOfficer.isPending,
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
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                <Tooltip title="Edit">
                  <IconButton
                    color="warning"
                    onClick={() => {
                      form.setValues({
                        id: row.original.id,
                        first_name: row.original.first_name,
                        last_name: row.original.last_name,
                        middle_name: row.original.middle_name,
                        suffix: row.original.suffix,
                        assumption_date: row.original.assumption_date,
                        designation: row.original.designation,
                        title: row.original.title,
                        credentials: row.original.credentials,
                        office: row.original.office_id,
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
                              .delete('accountable_officer/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries(['accountableOfficer'])

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
              </Box>
            )}
          />
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>{form.values.id ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm className="row g-3 mt-4" onSubmit={form.handleSubmit}>
            <CRow>
              <CCol md={3}>
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
              <CCol md={3}>
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
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Middle Initial"
                  name="middle_name"
                  onChange={handleInputChange}
                  value={form.values.middle_name}
                  placeholder="Middle Initial"
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Suffix"
                  name="suffix"
                  onChange={handleInputChange}
                  value={form.values.suffix}
                  placeholder="Suffix"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={3}>
                <CFormInput
                  type="date"
                  label="Date of Assumption"
                  name="assumption_date"
                  onChange={handleInputChange}
                  value={form.values.assumption_date}
                  placeholder="First Name"
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Designation"
                  name="designation"
                  onChange={handleInputChange}
                  value={form.values.designation}
                  placeholder="Designation"
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Title"
                  name="title"
                  onChange={handleInputChange}
                  value={form.values.title}
                  placeholder="Title"
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Credentials"
                  name="credentials"
                  onChange={handleInputChange}
                  value={form.values.credentials}
                  placeholder="Credentials"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={12}>
                <CFormLabel>{requiredField('Office')}</CFormLabel>

                <Select
                  ref={officeInputRef}
                  value={
                    !accountableOfficerOffice.isLoading &&
                    accountableOfficerOffice.data?.find(
                      (option) => option.value === form.values.office,
                    )
                  }
                  onChange={handleSelectChange}
                  options={!accountableOfficerOffice.isLoading && accountableOfficerOffice.data}
                  name="office"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  {form.values.id ? 'Update' : 'Submit'}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
          {(insertAccountableOfficer.isPending || updateAccountableOfficer.isPending) && (
            <DefaultLoading />
          )}
        </CModalBody>
      </CModal>
    </>
  )
}

export default AccountableOfficer
