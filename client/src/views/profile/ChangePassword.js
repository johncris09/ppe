import React, { useState } from 'react'
import './../../assets/css/react-paginate.css'
import { CButton, CCol, CForm, CFormInput, CFormLabel, CFormText, CInputGroup } from '@coreui/react'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
const ChangePassword = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [togglePassword, setTogglePassword] = useState(true)

  const userInfo = jwtDecode(localStorage.getItem('propertyPlantEquipmentToken'))
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
  const form = useFormik({
    initialValues: {
      id: '',
      password: '',
    },
    validationSchema: updatePasswordFormValidationSchema,
    onSubmit: async (values) => {
      console.info(values)
      if (values.id) {
        await updateUser.mutate(values)
      }
    },
  })

  const updateUser = useMutation({
    mutationFn: async (values) => {
      return await api.put('user/change_password/' + values.id, values)
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
        })
      }),
    queryKey: ['userProfilePassword'],
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
          <CFormLabel>{requiredField('Password')}</CFormLabel>
          <CInputGroup className="mb-3">
            <CFormInput
              type={togglePassword ? 'password' : 'text'}
              name="password"
              onChange={handleInputChange}
              value={form.values.password}
              placeholder="Password"
              required
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

        <hr />
        <CCol xs={12}>
          <CButton color="primary" type="submit" className="float-end">
            Update Password
          </CButton>
        </CCol>
      </CForm>
      {updateUser.isPending && <DefaultLoading />}
    </>
  )
}

export default ChangePassword
