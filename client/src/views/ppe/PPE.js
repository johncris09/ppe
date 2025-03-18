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
  CFormTextarea,
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
const PPE = ({ cardTitle }) => {
  const user = jwtDecode(localStorage.getItem('propertyPlantEquipmentToken'))
  const accountableOfficerPPERef = useRef()
  const equipmentTypePPERef = useRef()
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const column = [
    {
      accessorKey: 'equipment_type',
      header: 'Equipment Type',
      accessorFn: (row) => {
        return `${row.equipment_type}(${row.code})`
      },
      Cell: ({ cell }) => (
        <div style={{ whiteSpace: 'pre-line', wordWrap: 'break-word' }}>{cell.getValue()}</div>
      ),
    },
    {
      accessorKey: 'accountable_officer_id',
      header: 'Accountable Officer',
      accessorFn: (row) => {
        const fullName = `${row.accountable_officer_first_name} ${
          row.accountable_officer_middle_name || ''
        } ${row.accountable_officer_last_name} ${row.accountable_officer_suffix || ''}`.trim()
        return fullName.replace(/\s+/g, ' ')
      },
    },
    {
      accessorKey: 'article',
      header: 'Article',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      Cell: ({ cell }) => (
        <div style={{ whiteSpace: 'pre-line', wordWrap: 'break-word' }}>{cell.getValue()}</div>
      ),
    },
    {
      accessorKey: 'date_acquired',
      header: 'Date Acquired',
    },
    {
      accessorKey: 'stock_number',
      header: 'Stock Number',
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
    },
    {
      accessorKey: 'value',
      header: 'Value',
    },
    {
      accessorKey: 'balance_per_card',
      header: 'Balance Per Card',
    },
    {
      accessorKey: 'onhand_per_count',
      header: 'On Hand Per Count',
    },
    {
      accessorKey: 'shortage_quantity',
      header: 'Storage Quantity',
    },
    {
      accessorKey: 'storage_value',
      header: 'Storage Value',
    },
    {
      accessorKey: 'end_user',
      header: 'Remarks',
      accessorFn: (row) => {
        if (row.remarks) {
          return `${row.end_user}\n${row.remarks}` // Use \n for line break
        }
        return row.end_user || '' // Ensure it returns a string
      },
      Cell: ({ cell }) => (
        <div style={{ whiteSpace: 'pre-line', wordWrap: 'break-word' }}>{cell.getValue()}</div>
      ),
    },
  ]

  const ppe = useQuery({
    queryFn: async () =>
      await api.get('ppe').then((response) => {
        return response.data
      }),
    queryKey: ['ppe'],
    staleTime: Infinity,
  })

  const accountableOfficerPPE = useQuery({
    queryFn: async () =>
      await api.get('accountable_officer').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.first_name} ${item.middle_name || ''} ${item.last_name} ${
            item.suffix || ''
          }`.trim()

          return { value, label }
        })

        return formattedData
      }),
    queryKey: ['accountableOfficerPPE'],
    staleTime: Infinity,
  })

  const equipmentTypePPE = useQuery({
    queryFn: async () =>
      await api.get('equipment_type').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = item.code
            ? `${item.equipment_type} (${item.code || ''})`.trim()
            : `${item.equipment_type}`.trim()

          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['equipmentTypePPE'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    equipment_type: Yup.string().required('Equipment Type is required'),
    accountable_officer: Yup.string().required('Accountable Officer is required'),
    article: Yup.string().required('Article is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      equipment_type: '',
      accountable_officer: '',
      article: '',
      date_acquired: '',
      stock_number: '',
      unit: '',
      value: '',
      balance_per_card: '',
      onhand_per_count: '',
      shortage_quantity: '',
      storage_value: '',
      end_user: '',
      remarks: '',
      encoded_by: user.id,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updatePPE.mutate(values)
      } else {
        await insertPPE.mutate(values)
      }
    },
  })

  const insertPPE = useMutation({
    mutationFn: async (values) => {
      return await api.post('ppe/insert', values)
    },
    onSuccess: async (response) => {
      console.info(response.data)
      if (response.data.status) {
        toast.success(response.data.message)
        form.resetForm()
        setModalVisible(false)
        await queryClient.invalidateQueries(['ppe'])
      } else {
        toast.error(response.data.message)
      }
    },
    onError: (error) => {
      toast.error('Duplicate Entry!')
    },
  })
  const updatePPE = useMutation({
    mutationFn: async (values) => {
      return await api.put('ppe/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      console.info(response.data)
      if (response.data.status) {
        toast.success(response.data.message)
        form.resetForm()
        setModalVisible(false)
        await queryClient.invalidateQueries(['ppe'])
      } else {
        toast.error(response.data.message)
      }
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
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
            data={!ppe.isLoading && ppe.data}
            state={{
              isLoading: ppe.isLoading || insertPPE.isPending || updatePPE.isPending,
              isSaving: ppe.isLoading || insertPPE.isPending || updatePPE.isPending,
              showLoadingOverlay: ppe.isLoading || insertPPE.isPending || updatePPE.isPending,
              showProgressBars: ppe.isLoading || insertPPE.isPending || updatePPE.isPending,
              showSkeletons: ppe.isLoading || insertPPE.isPending || updatePPE.isPending,
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
            enableGrouping
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
                      console.info(row.original.stock_number)
                      form.setValues({
                        id: row.original.id,
                        equipment_type: row.original.equipment_type_id,
                        accountable_officer: row.original.accountable_officer_id,
                        article: row.original.article,
                        description: row.original.description,
                        date_acquired: row.original.date_acquired,
                        stock_number: row.original.stock_number,
                        unit: row.original.unit,
                        value: row.original.value,
                        balance_per_card: row.original.balance_per_card,
                        onhand_per_count: row.original.onhand_per_count,
                        shortage_quantity: row.original.shortage_quantity,
                        storage_value: row.original.storage_value,
                        remarks: row.original.remarks,
                        end_user: row.original.end_user,
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
                              .delete('ppe/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries(['ppe'])

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
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>{form.values.id ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm className="row g-3   mt-4" onSubmit={form.handleSubmit}>
            <CRow>
              <CCol md={6}>
                <CFormLabel>{requiredField('Equipment Type')}</CFormLabel>

                <Select
                  ref={equipmentTypePPERef}
                  value={
                    !equipmentTypePPE.isLoading &&
                    equipmentTypePPE.data?.find(
                      (option) => option.value === form.values.equipment_type,
                    )
                  }
                  onChange={handleSelectChange}
                  options={!equipmentTypePPE.isLoading && equipmentTypePPE.data}
                  name="equipment_type"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
                {form.touched.abbr && form.errors.abbr && (
                  <CFormText className="text-danger">{form.errors.abbr}</CFormText>
                )}
              </CCol>
              <CCol md={6}>
                <CFormLabel>{requiredField('Accountable Officer')}</CFormLabel>

                <Select
                  ref={accountableOfficerPPERef}
                  value={
                    !accountableOfficerPPE.isLoading &&
                    accountableOfficerPPE.data?.find(
                      (option) => option.value === form.values.accountable_officer,
                    )
                  }
                  onChange={handleSelectChange}
                  options={!accountableOfficerPPE.isLoading && accountableOfficerPPE.data}
                  name="accountable_officer"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
                {form.touched.accountable_officer && form.errors.accountable_officer && (
                  <CFormText className="text-danger">{form.errors.accountable_officer}</CFormText>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol md={6}>
                <CRow>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      label={requiredField('Article')}
                      name="article"
                      onChange={handleInputChange}
                      value={form.values.article}
                      placeholder="Article"
                      invalid={form.touched.article && form.errors.article}
                    />
                    {form.touched.article && form.errors.article && (
                      <CFormText className="text-danger">{form.errors.article}</CFormText>
                    )}
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="date"
                      label="Date Acquired"
                      name="date_acquired"
                      onChange={handleInputChange}
                      value={form.values.date_acquired}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      label="Stock Number"
                      name="stock_number"
                      onChange={handleInputChange}
                      value={form.values.stock_number}
                      placeholder="0"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      label="Unit"
                      name="unit"
                      onChange={handleInputChange}
                      value={form.values.unit}
                      placeholder="Unit"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="number"
                      label={requiredField('Value')}
                      name="value"
                      onChange={handleInputChange}
                      value={form.values.value}
                      placeholder="0"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="number"
                      label="Balance per Card(qty)"
                      name="balance_per_card"
                      onChange={handleInputChange}
                      value={form.values.balance_per_card}
                      placeholder="0"
                    />
                  </CCol>
                </CRow>
              </CCol>
              <CCol md={6}>
                <CRow>
                  <CCol md={12}>
                    <CFormTextarea
                      label={requiredField('Description')}
                      name="description"
                      onChange={handleInputChange}
                      placeholder="Description"
                      rows={7}
                      invalid={form.touched.description && form.errors.description}
                    >
                      {form.values.description}
                    </CFormTextarea>

                    {form.touched.description && form.errors.description && (
                      <CFormText className="text-danger">{form.errors.description}</CFormText>
                    )}
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
            <CRow>
              <CCol md={4}>
                <CFormInput
                  type="number"
                  label="On Hand per Count"
                  name="onhand_per_count"
                  onChange={handleInputChange}
                  value={form.values.onhand_per_count}
                  placeholder="0"
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="number"
                  label="Shortage Quantity"
                  name="shortage_quantity"
                  onChange={handleInputChange}
                  value={form.values.shortage_quantity}
                  placeholder="0"
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="number"
                  label="Shortage Value"
                  name="storage_value"
                  onChange={handleInputChange}
                  value={form.values.storage_value}
                  placeholder="0"
                />
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="End User"
                  name="end_user"
                  onChange={handleInputChange}
                  value={form.values.end_user}
                  placeholder="End User"
                />
              </CCol>
              <CCol md={6}>
                <CFormTextarea
                  label="Remarks"
                  name="remarks"
                  onChange={handleInputChange}
                  placeholder="Remarks..."
                  rows={2}
                >
                  {form.values.remarks}
                </CFormTextarea>
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
          {(insertPPE.isPending || updatePPE.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default PPE
