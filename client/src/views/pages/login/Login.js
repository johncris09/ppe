import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CRow,
} from '@coreui/react'
import logo from './../../../assets/images/logo.png'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { DefaultLoading, api } from 'src/components/SystemConfiguration'
import { jwtDecode } from 'jwt-decode'
import './../../../assets/css/custom.css'
const Login = () => {
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const isTokenExist = localStorage.getItem('propertyPlantEquipmentToken') !== null
    if (isTokenExist) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },

    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setLoading(true)
        await api
          .post('login', values)
          .then(async (response) => {
            if (response.data.status) {
              localStorage.setItem('propertyPlantEquipmentToken', response.data.token)

              navigate('/dashboard', { replace: true })
            } else {
              toast.error(response.data.message)
            }
          })
          .catch((error) => {
            toast.error('The server is closed. Please try again later.')

            // toast.error(handleError(error))
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setValidated(true)
      }
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    formik.setFieldValue(name, value)
  }

  return (
    <>
      <ToastContainer />

      <div className=" min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol xs={12} sm={12} lg={6} xl={6}>
              <CCard
                className="p-4"
                style={{
                  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                }}
              >
                <CCardBody>
                  <div className="text-center">
                    <CImage
                      rounded
                      src={logo}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '150px',
                        maxHeight: '150px',
                      }}
                    />
                  </div>

                  <CForm
                    className="row g-3 needs-validation"
                    onSubmit={formik.handleSubmit}
                    // noValidate
                    validated={validated}
                  >
                    <h3 className="text-center">
                      <strong>{process.env.REACT_APP_PROJECT_TITLE}</strong>
                    </h3>
                    <p className="text-medium-emphasis text-center">Sign In to your account</p>

                    <CFormInput
                      className="text-center py-2"
                      style={{ borderRadius: 50 }}
                      type="text"
                      placeholder="Username"
                      name="username"
                      onChange={handleInputChange}
                      value={formik.values.username}
                      required
                    />
                    <CFormInput
                      className="text-center py-2"
                      style={{ borderRadius: 50 }}
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={handleInputChange}
                      value={formik.values.password}
                      required
                    />
                    <CButton type="submit" shape="rounded-pill" color="primary">
                      Login
                    </CButton>
                  </CForm>
                  {loading && <DefaultLoading />}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Login
