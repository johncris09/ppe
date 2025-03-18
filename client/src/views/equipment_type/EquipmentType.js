import React, { useState } from 'react'
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
const EquipmentType = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const column = [
    {
      accessorKey: 'equipment_type',
      header: 'Equipment Type',
    },
    {
      accessorKey: 'code',
      header: 'Code',
    },
  ]

  const equipmentType = useQuery({
    queryFn: async () =>
      await api.get('equipment_type').then((response) => {
        return response.data
      }),
    queryKey: ['equipmentType'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    equipment_type: Yup.string().required('Equipment Type is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      equipment_type: '',
      code: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateEquipmentType.mutate(values)
      } else {
        await insertEquipmentType.mutate(values)
      }
    },
  })

  const insertEquipmentType = useMutation({
    mutationFn: async (values) => {
      return await api.post('equipment_type/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
        form.resetForm()
        setModalVisible(false)
        await queryClient.invalidateQueries(['equipmentType'])
      } else {
        toast.error(response.data.message)
      }
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error!',
        html: 'Internal Server Error',
        icon: 'error',
      })
    },
  })
  const updateEquipmentType = useMutation({
    mutationFn: async (values) => {
      return await api.put('equipment_type/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      console.info(response.data)
      if (response.data.status) {
        toast.success(response.data.message)
        form.resetForm()
        setModalVisible(false)
        await queryClient.invalidateQueries(['equipmentType'])
      } else {
        toast.error(response.data.message)
      }
    },
    onError: (error) => {
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
            data={!equipmentType.isLoading && equipmentType.data}
            state={{
              isLoading:
                equipmentType.isLoading ||
                insertEquipmentType.isPending ||
                updateEquipmentType.isPending,
              isSaving:
                equipmentType.isLoading ||
                insertEquipmentType.isPending ||
                updateEquipmentType.isPending,
              showLoadingOverlay:
                equipmentType.isLoading ||
                insertEquipmentType.isPending ||
                updateEquipmentType.isPending,
              showProgressBars:
                equipmentType.isLoading ||
                insertEquipmentType.isPending ||
                updateEquipmentType.isPending,
              showSkeletons:
                equipmentType.isLoading ||
                insertEquipmentType.isPending ||
                updateEquipmentType.isPending,
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
                        equipment_type: row.original.equipment_type,
                        code: row.original.code,
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
                              .delete('equipment_type/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries(['equipmentType'])

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
          <CForm className="row g-3   mt-4" onSubmit={form.handleSubmit}>
            <CRow>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label={requiredField('Equipment Type')}
                  name="equipment_type"
                  onChange={handleInputChange}
                  value={form.values.equipment_type}
                  placeholder="Equipment Type"
                  invalid={form.touched.equipment_type && form.errors.equipment_type}
                />
                {form.touched.equipment_type && form.errors.equipment_type && (
                  <CFormText className="text-danger">{form.errors.equipment_type}</CFormText>
                )}
              </CCol>
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Code"
                  name="code"
                  onChange={handleInputChange}
                  value={form.values.code}
                  placeholder="Code"
                  invalid={form.touched.code && form.errors.code}
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
          {(insertEquipmentType.isPending || updateEquipmentType.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default EquipmentType
