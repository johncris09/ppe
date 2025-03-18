import React from 'react'
import './../../assets/css/react-paginate.css'
import { CButton, CCol, CForm, CFormInput } from '@coreui/react'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const UserProfile = () => {
  const queryClient = useQueryClient()
  const userInfo = jwtDecode(localStorage.getItem('propertyPlantEquipmentToken'))

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    username: Yup.string().required('Username is required'),
  })

  const form = useFormik({
    initialValues: {
      id: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      username: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateUser.mutate(values)
      }
    },
  })

  const updateUser = useMutation({
    mutationFn: async (values) => {
      return await api.put('user/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries(['userProfile'])
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const userProfile = useQuery({
    queryFn: async () =>
      await api.get('user/find/' + userInfo.id).then((response) => {
        form.setValues({
          id: response.data.id,
          first_name: response.data.first_name,
          middle_name: response.data.middle_name,
          last_name: response.data.last_name,
          username: response.data.username,
        })
      }),
    queryKey: ['userProfile'],
    staleTime: Infinity,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    form.setFieldValue(name, value)
  }

  return (
    <>
      <ToastContainer />
      <RequiredFieldNote />
      <CForm
        className="row g-3  mt-4"
        onSubmit={form.handleSubmit}
        style={{ position: 'relative' }}
      >
        <CCol md={12}>
          <CFormInput
            type="text"
            label={requiredField('First Name')}
            name="first_name"
            onChange={handleInputChange}
            value={form.values.first_name}
            required
            placeholder="First Name"
          />
          <CFormInput
            type="text"
            label="Middle Initial"
            name="middle_name"
            onChange={handleInputChange}
            value={form.values.middle_name}
            placeholder="Middle Initial"
          />
          <CFormInput
            type="text"
            label={requiredField('Last Name')}
            name="last_name"
            onChange={handleInputChange}
            value={form.values.last_name}
            required
            placeholder="Last Name"
          />
          <CFormInput
            type="text"
            label={requiredField('Username')}
            name="username"
            onChange={handleInputChange}
            value={form.values.username}
            required
            placeholder="Username"
          />
        </CCol>

        <hr />
        <CCol xs={12}>
          <CButton color="primary" type="submit" className="float-end">
            Update Profile
          </CButton>
        </CCol>
      </CForm>
      {updateUser.isPending && <DefaultLoading />}
    </>
  )
}

export default UserProfile
