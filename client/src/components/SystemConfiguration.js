import React from 'react'
import CryptoJS from 'crypto-js'
import { MagnifyingGlass, Oval, RotatingLines } from 'react-loader-spinner'
import Swal from 'sweetalert2'
import axios from 'axios'

const isProduction = false

const api = axios.create({
  baseURL: isProduction
    ? process.env.REACT_APP_BASEURL_PRODUCTION
    : process.env.REACT_APP_BASEURL_DEVELOPMENT,

  auth: {
    username: process.env.REACT_APP_API_USERNAME,
    password: process.env.REACT_APP_API_PASSWORD,
  },
})

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()

const officer = 'WELITA C. LARA'
const position = 'Supervising Manpower Development Officer'

const asterisk = () => {
  return <span className="text-danger">*</span>
}
const motorVehicleStatus = [
  'Serviceable',
  'Under Repair',
  'Storage',
  'Change Color',
  'Unserviceable',
]
const fuelType = ['Gas', 'Diesel', 'Regular', 'Premium']
const vehicleType = ['Motor Vehicle', 'Heavy Equipment']

const CryptoJSAesJson = {
  stringify: function (cipherParams) {
    var j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) }
    if (cipherParams.iv) j.iv = cipherParams.iv.toString()
    if (cipherParams.salt) j.s = cipherParams.salt.toString()
    return JSON.stringify(j)
  },
  parse: function (jsonStr) {
    var j = JSON.parse(jsonStr)
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    })
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
    return cipherParams
  },
}

const decrypted = (data) => {
  const decryptedData = JSON.parse(
    CryptoJS.AES.decrypt(data, process.env.REACT_APP_ENCRYPTION_KEY, {
      format: CryptoJSAesJson,
    }).toString(CryptoJS.enc.Utf8),
  )

  return JSON.parse(decryptedData)
}
const encrypt = (data) => {
  var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.REACT_APP_ENCRYPTION_KEY, {
    format: CryptoJSAesJson,
  }).toString()

  return encrypted
}

const toSentenceCase = (value) => {
  try {
    return value
      .toLowerCase()
      .split(' ')
      .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
      .join(' ')
  } catch (error) {
    return value
  }
}

const getFirstLetters = (value) => {
  const words = value.split(' ').map((word) => word.charAt(0).toUpperCase())
  return words.join('')
}

const formatFileSize = (size) => {
  if (size === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = parseInt(Math.floor(Math.log(size) / Math.log(k)))
  return Math.round(100 * (size / Math.pow(k, i))) / 100 + ' ' + sizes[i]
}

const calculateAge = (value) => {
  try {
    const birthDate = new Date(value)
    const currentDate = new Date()

    const ageInMilliseconds = currentDate - birthDate
    const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000))
    return ageInYears
  } catch (error) {
    return value
  }
}

const handleError = (error) => {
  let errorMessage

  switch (error.code) {
    case 'ERR_BAD_REQUEST':
      errorMessage = 'Resource not found. Please check the URL!'
      break
    case 'ERR_BAD_RESPONSE':
      errorMessage = 'Internal Server Error. Please try again later.'
      break
    case 'ERR_NETWORK':
      errorMessage = 'Please check your internet connection and try again!'
      break
    case 'ECONNABORTED':
      errorMessage = 'The request timed out. Please try again later.'
      break
    case 'ERR_SERVER':
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = 'Internal Server Error. Please try again later.'
        } else if (error.response.status === 404) {
          errorMessage = 'Resource not found. Please check the URL.'
        } else if (error.response.status === 403) {
          errorMessage = 'Access forbidden. Please check your permissions.'
        } else {
          errorMessage = `Unexpected server error: ${error.response.status}`
        }
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.'
      }
      break
    case 'ERR_CLIENT':
      if (error.response && error.response.status === 400) {
        errorMessage = 'Bad request. Please check your input.'
      } else if (error.response && error.response.status === 401) {
        errorMessage = 'Unauthorized. Please check your credentials.'
      } else if (error.response && error.response.status === 429) {
        errorMessage = 'Too many requests. Please try again later.'
      } else {
        errorMessage = 'Client error. Please check your request.'
      }
      break
    default:
      console.error('An error occurred:', error)
      errorMessage = 'An unexpected error occurred. Please try again.'
      break
  }

  return errorMessage
}

const DefaultLoading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.07)', // Adjust the background color and opacity as needed
        zIndex: 999, // Ensure the backdrop is above other content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Oval
        height={40}
        width={40}
        color="#34aadc"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#34aadc"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  )
}

const MagnifyingGlassLoading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.07)', // Adjust the background color and opacity as needed
        zIndex: 999, // Ensure the backdrop is above other content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MagnifyingGlass
        visible={true}
        height={80}
        width={80}
        ariaLabel="magnifying-glass-loading"
        wrapperStyle={{}}
        wrapperClass="magnifying-glass-wrapper"
        glassColor="#c0efff"
        color="#321fdb"
      />
    </div>
  )
}

const WidgetLoading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.001)', // Adjust the background color and opacity as needed
        zIndex: 999, // Ensure the backdrop is above other content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Oval
        height={30}
        width={30}
        color="#34aadc"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#34aadc"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  )
}

const WholePageLoading = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.07)', // Adjust the background color and opacity as needed
        zIndex: 999, // Ensure the backdrop is above other content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div>
        <RotatingLines
          visible={true}
          color="#34aadc"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
          height={40}
          width={40}
          strokeWidthSecondary={2}
        />
        <p style={{ marginLeft: '-20px', fontSize: '16px' }}>Please wait...</p>
      </div>
    </div>
  )
}

const RequiredFieldNote = (label) => {
  return (
    <>
      <div>
        <small className="text-muted">
          Note: <span className="text-danger">*</span> is required
        </small>
      </div>
    </>
  )
}
const requiredField = (label) => {
  return (
    <>
      <span>
        {label} <span className="text-danger">*</span>
      </span>
    </>
  )
}

const validationPrompt = (operationCallback) => {
  try {
    Swal.fire({
      title: 'Please enter the secret key to proceed.',
      input: 'password',
      icon: 'info',
      customClass: {
        validationMessage: 'my-validation-message',
        alignment: 'text-center',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('This field is required')
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then(async function (result) {
      if (result.isConfirmed) {
        if (result.value === process.env.REACT_APP_STATUS_APPROVED_KEY) {
          operationCallback()
        } else {
          Swal.fire({
            title: 'Error!',
            html: 'Invalid Secret Key',
            icon: 'error',
          })
        }
      }
    })
  } catch (error) {
    return false
  }
}

const roleType = [
  { value: '', label: 'Select' },
  { value: 'Super Admin', label: 'Super Admin' },
  { value: 'Admin', label: 'Admin' },
  { value: 'User', label: 'User' },
]
const months = [
  { name: 'January', number: 1 },
  { name: 'February', number: 2 },
  { name: 'March', number: 3 },
  { name: 'April', number: 4 },
  { name: 'May', number: 5 },
  { name: 'June', number: 6 },
  { name: 'July', number: 7 },
  { name: 'August', number: 8 },
  { name: 'September', number: 9 },
  { name: 'October', number: 10 },
  { name: 'November', number: 11 },
  { name: 'December', number: 12 },
]
export {
  roleType,
  getFirstLetters,
  validationPrompt,
  requiredField,
  RequiredFieldNote,
  DefaultLoading,
  MagnifyingGlassLoading,
  WidgetLoading,
  WholePageLoading,
  handleError,
  calculateAge,
  formatFileSize,
  toSentenceCase,
  decrypted,
  encrypt,
  asterisk,
  api,
  officer,
  position,
  months,
  currentYear,
  currentMonth,
  motorVehicleStatus,
  fuelType,
  vehicleType,
}
