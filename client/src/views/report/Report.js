import React, { useRef, useState } from 'react'
import * as Yup from 'yup'
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate'
import * as XLSX from 'xlsx'
import Select from 'react-select'
import './../../assets/css/custom.css'
import 'cropperjs/dist/cropper.css'
import reportTemplate from './../../assets/report template/PPEReportTemplate.xlsx'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormText,
  CRow,
} from '@coreui/react'
import { useFormik } from 'formik'
import { ToastContainer } from 'react-toastify'
import {
  api,
  DefaultLoading,
  motorVehicleStatus,
  requiredField,
} from 'src/components/SystemConfiguration'
import { useMutation, useQuery } from '@tanstack/react-query'
import PageTitle from 'src/components/PageTitle'
import Swal from 'sweetalert2'

const now = new Date()
const formattedDate = `${
  now.getMonth() + 1
}-${now.getDate()}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

const Report = ({ cardTitle }) => {
  const officeInputRef = useRef()
  const accountableOfficerInputRef = useRef()

  const motorVehicleReport = useQuery({
    queryFn: async () =>
      await api.get('office').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.abbr} - ${item.office}`.trim()
          const abbr = `${item.abbr}`.trim()
          return { value, abbr, label }
        })
        return formattedData
      }),
    queryKey: ['motorVehicleReport'],
    staleTime: Infinity,
  })
  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value, checked } = e.target
    const { status } = form.values

    form.setFieldValue(name, value)
  }

  function shortenSheetName(name, maxLength = 31) {
    const abbreviations = {
      INFORMATION: 'INFO',
      COMMUNICATION: 'COMM',
      TECHNOLOGY: 'TECH',
      EQUIPMENTS: 'EQPT',
      AND: '&',
    }

    // Replace words with abbreviations
    let shortenedName = name
      .split(' ')
      .map((word) => abbreviations[word.toUpperCase()] || word) // Convert only known words
      .join(' ')

    // Trim if still longer than maxLength
    return shortenedName.length > maxLength ? shortenedName.substring(0, maxLength) : shortenedName
  }
  const validationSchema = Yup.object().shape({
    date: Yup.string().required('Date is required'),
    office: Yup.string().required('Office is required'),
    accountable_officer: Yup.string().required('Accountable Officer is required'),
  })
  const form = useFormik({
    initialValues: {
      date: '',
      office: '',
      accountable_officer: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // console.info(values)
      report.mutate(values)
    },
  })

  const report = useMutation({
    mutationFn: async (values) => {
      return await api.get('ppe/get_report', { params: values })
    },
    onSuccess: async (response, values) => {
      const selectedOffice = officeInputRef.current.getValue()[0]
      if (Array.isArray(response.data) && response.data.length === 0) {
        Swal.fire('Error!', 'No Record Found', 'error')
      } else if (
        typeof response.data === 'object' &&
        response.data !== null &&
        !Array.isArray(response.data) &&
        Object.keys(response.data).length === 0
      ) {
        Swal.fire('Error!', 'No Record Found', 'error')
      } else {
        XlsxPopulate.fromBlankAsync()
          .then((workbook) => {
            const date = new Date(values.date)
            const formatteddate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
            Object.entries(response.data).forEach(([equipment_type, row]) => {
              const equipmentType = `${row.equipment_type} (${row.code})`
              const sheet = workbook.addSheet(shortenSheetName(equipmentType))

              // Title
              sheet
                .range('B1:J1')
                .merged(true)
                .value('REPORT ON THE PHYSICAL COUNT OF PROPERTY, PLANT AND EQUIPMENT')
                .style({ horizontalAlignment: 'center', bold: true, fontSize: 10 })

              // Annex Number
              sheet
                .cell('K1')
                .value('ANNEX 49')
                .style({ horizontalAlignment: 'center', fontSize: 8 })

              // Equipment Type
              sheet
                .range('B2:J2')
                .merged(true)
                .value(equipmentType)
                .style({ horizontalAlignment: 'center', underline: true, bold: true, fontSize: 10 })

              // Equipment Type Description
              sheet
                .range('B3:J3')
                .merged(true)
                .value('(Type of Property, Plant and Equipment)')
                .style({ horizontalAlignment: 'center', fontSize: 9 })

              // Date
              sheet
                .range('B4:J4')
                .merged(true)
                .value('As of ' + formatteddate)
                .style({ horizontalAlignment: 'center', bold: true })

              // Page Label
              // sheet
              //   .cell('K3')
              //   .value('Page ' + index + 1)
              //   .style({ fontSize: 9 })

              // Starting Cell for Data
              sheet.cell('A5').value('For which')

              sheet
                .cell('G5')
                .value('is accountable, having assumed such accountability on')
                .style({ fontSize: 8 })

              sheet
                .cell('K5')
                .value(row.accountable_officer_assumption_date)
                .style({
                  bold: true,
                  horizontalAlignment: 'center',
                  fontSize: 10,
                  border: {
                    bottom: { style: 'thin' }, // Adds a thin bottom border
                  },
                })

              sheet
                .cell('K6')
                .value('(Date  of  Assumption)')
                .style({ bold: true, horizontalAlignment: 'center', fontSize: 10 })

              const office = `${row.accountable_officer_office}`
              const accountable_officer =
                (row.accountable_officer_title ? row.accountable_officer_title + ' ' : '') +
                (row.accountable_officer_last_name ? row.accountable_officer_last_name + ' ' : '') +
                (row.accountable_officer_middle_name
                  ? row.accountable_officer_middle_name + ' '
                  : '') +
                (row.accountable_officer_first_name
                  ? row.accountable_officer_first_name + ' '
                  : '') +
                (row.accountable_officer_suffix ? row.accountable_officer_suffix + ' ' : '') +
                (row.accountable_officer_designation
                  ? row.accountable_officer_designation
                  : ''
                ).trim()

              sheet
                .range('B5:F5')
                .merged(true)
                .value(accountable_officer + ' ' + office + ' City Government of Oroquieta')
                .style({
                  bold: true,
                  border: {
                    bottom: { style: 'thick' },
                  },
                  wrapText: true,
                })

              sheet
                .cell('B6')
                .value('(Name  of Accountable  Officer)')
                .style({ bold: true, fontSize: 9, wrapText: true })

              sheet.range('C6:D6').merged(true).value('(Official  Designation)').style({
                bold: true,
                fontSize: 9,
                wrapText: true,
              })
              sheet.cell('F6').value('LGU').style({ bold: true, fontSize: 9, wrapText: true })

              sheet.range(`A6:K6`).style({
                horizontalAlignment: 'center', // Center horizontally
                verticalAlignment: 'top', // Align to the top
              })

              // Apply wrap text to Column B
              sheet.column('B').style({ wrapText: true })

              // Define column headers

              // Merge cells for headers to mimic rowspan and colspan
              sheet.range('A8:A10').merged(true).value('ARTICLE').style({ wrapText: true })
              sheet.range('B8:C10').merged(true).value('DESCRIPTION').style({ wrapText: true })
              sheet.range('D8:D10').merged(true).value('STOCK NUMBER').style({ wrapText: true })
              sheet.range('E8:E10').merged(true).value('UNIT OF MEASURE').style({ wrapText: true })
              sheet.range('F8:F10').merged(true).value('UNIT VALUES').style({ wrapText: true })
              sheet
                .range('G8:G10')
                .merged(true)
                .value('BALANCE PER CARD (QTY)')
                .style({ wrapText: true })
              sheet
                .range('H8:H10')
                .merged(true)
                .value('ON HAND PER COUNT (QTY)')
                .style({ wrapText: true })
              sheet.range('I8:J9').merged(true).value('SHORTAGE/OVERAGE').style({ wrapText: true })
              sheet.cell('I10').value('QTY') // Sub-header
              sheet.cell('J10').value('VALUE') // Sub-header
              sheet.range('K8:K10').merged(true).value('REMARKS')

              // Apply styles
              sheet.range('A8:K10').style({
                bold: true,
                horizontalAlignment: 'center',
                verticalAlignment: 'center',
                fill: 'CCCCCC', // Light gray background
                border: true,
              })

              let startRow = 11 // Data starts at row 11

              if (row.items.length > 0) {
                row.items.forEach((item, index) => {
                  let currentRow = startRow + index

                  let value = parseFloat(item.value)
                  let formatNumber = value.toLocaleString('en-US', { minimumFractionDigits: 2 })

                  sheet
                    .cell(`A${currentRow}`)
                    .value(item.article)
                    .style({
                      verticalAlignment: 'top',
                      horizontalAlignment: 'center',
                      border: {
                        top: { style: 'thin', color: 'black' },
                        bottom: { style: 'thin', color: 'black' },
                        left: { style: 'thin', color: 'black' },
                        right: { style: 'thin', color: 'black' },
                      },
                    })
                  sheet
                    .cell(`B${currentRow}`)
                    .value(item.description)
                    .style({
                      verticalAlignment: 'top',
                      horizontalAlignment: 'left',

                      border: {
                        top: { style: 'thin', color: 'black' },
                        bottom: { style: 'thin', color: 'black' },
                        left: { style: 'thin', color: 'black' },
                      },
                    })
                  sheet
                    .cell(`C${currentRow}`)
                    .value(item.date_acquired)
                    .style({
                      verticalAlignment: 'top',
                      horizontalAlignment: 'left',

                      border: {
                        top: { style: 'thin', color: 'black' },
                        bottom: { style: 'thin', color: 'black' },
                        right: { style: 'thin', color: 'black' },
                      },
                    })
                  sheet
                    .cell(`D${currentRow}`)
                    .value(item.stock_number)
                    .style({
                      verticalAlignment: 'top',
                      horizontalAlignment: 'center',
                      border: {
                        top: { style: 'thin', color: 'black' },
                        bottom: { style: 'thin', color: 'black' },
                        left: { style: 'thin', color: 'black' },
                        right: { style: 'thin', color: 'black' },
                      },
                    })
                  sheet
                    .cell(`E${currentRow}`)
                    .value(item.unit)
                    .style({
                      verticalAlignment: 'top',
                      horizontalAlignment: 'center',
                      border: {
                        top: { style: 'thin', color: 'black' },
                        bottom: { style: 'thin', color: 'black' },
                        left: { style: 'thin', color: 'black' },
                        right: { style: 'thin', color: 'black' },
                      },
                    })

                  sheet
                    .cell(`F${currentRow}`)
                    .value(formatNumber)
                    .style({
                      verticalAlignment: 'top',
                      horizontalAlignment: 'right',
                      border: {
                        top: { style: 'thin', color: 'black' },
                        bottom: { style: 'thin', color: 'black' },
                        left: { style: 'thin', color: 'black' },
                        right: { style: 'thin', color: 'black' },
                      },
                    })

                  sheet
                    .cell(`G${currentRow}`)
                    .value(item.balance_per_card)
                    .style({
                      verticalAlignment: 'top',
                      horizontalAlignment: 'center',
                      border: {
                        top: { style: 'thin', color: 'black' },
                        bottom: { style: 'thin', color: 'black' },
                        left: { style: 'thin', color: 'black' },
                        right: { style: 'thin', color: 'black' },
                      },
                    })
                  sheet
                    .cell(`H${currentRow}`)
                    .value(item.onhand_per_count)
                    .style({
                      verticalAlignment: 'top',
                      horizontalAlignment: 'center',
                      border: {
                        top: { style: 'thin', color: 'black' },
                        bottom: { style: 'thin', color: 'black' },
                        left: { style: 'thin', color: 'black' },
                        right: { style: 'thin', color: 'black' },
                      },
                    })
                  sheet
                    .cell(`I${currentRow}`)
                    .value(item.shortage_quantity)
                    .style({
                      verticalAlignment: 'top',
                      horizontalAlignment: 'center',
                      border: {
                        top: { style: 'thin', color: 'black' },
                        bottom: { style: 'thin', color: 'black' },
                        left: { style: 'thin', color: 'black' },
                        right: { style: 'thin', color: 'black' },
                      },
                    })
                  sheet
                    .cell(`J${currentRow}`)
                    .value(item.storage_value)
                    .style({
                      verticalAlignment: 'top',
                      horizontalAlignment: 'center',
                      border: {
                        top: { style: 'thin', color: 'black' },
                        bottom: { style: 'thin', color: 'black' },
                        left: { style: 'thin', color: 'black' },
                        right: { style: 'thin', color: 'black' },
                      },
                    })
                  const remarks = item.remarks ? `\n${item.remarks}` : ''

                  sheet
                    .cell(`K${currentRow}`)
                    .value(`${item.end_user}${remarks}`) // Add newline between values
                    .style({
                      verticalAlignment: 'top',
                      horizontalAlignment: 'center',
                      border: {
                        top: { style: 'thin', color: 'black' },
                        bottom: { style: 'thin', color: 'black' },
                        left: { style: 'thin', color: 'black' },
                        right: { style: 'thin', color: 'black' },
                      },
                    })
                  // Auto-adjust row height (estimate based on text length)
                  // let maxLength = Math.max(
                  //   item.article ? item.article.length : 0,
                  //   item.description ? item.description.length : 0,
                  //   item.stock_number ? item.stock_number.length : 0,
                  //   item.unit ? item.unit.length : 0,
                  //   item.value ? item.value.length : 0,
                  //   item.value ? item.value.length : 0,
                  //   // item.end_user
                  //   //   ? item.end_user.length
                  //   //   : 0 + item.remarks
                  //   //   ? item.end_user.length
                  //   //   : 0, // Combine multiline content
                  // )

                  // let estimatedHeight = Math.ceil(maxLength / 15) * 20 // Approximate height calculation

                  // sheet.row(currentRow).height(estimatedHeight)
                })
              }

              // Apply styles
              // sheet.range(`A${startRow}:K${startRow + row.items.length - 1}`).style({
              //   border: {
              //     top: { style: 'thin', color: 'black' },
              //     bottom: { style: 'thin', color: 'black' },
              //     left: { style: 'thin', color: 'black' },
              //     right: { style: 'thin', color: 'black' },
              //   },
              // })

              // set Column width
              sheet.column('A').width(18)
              sheet.column('B').width(40)
              sheet.column('C').width(10)
              sheet.column('D').width(9)
              sheet.column('E').width(15)
              sheet.column('F').width(22)
              sheet.column('G').width(11)
              sheet.column('I').width(6)
              sheet.column('J').width(7)
              sheet.column('K').width(25)
            })

            // **Remove the default "Sheet1"**
            workbook.deleteSheet('Sheet1')

            return workbook.outputAsync()
          })
          .then((updatedBuffer) => {
            // Create a downloadable link
            const blob = new Blob([updatedBuffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
            const url = URL.createObjectURL(blob)
            // Create a download link
            const a = document.createElement('a')
            a.href = url
            a.download = selectedOffice.abbr + ' - PPE ' + formattedDate + '.xlsx'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url) // Clean up
          })
          .catch((error) => console.error('Error processing Excel file:', error))
      }
    },
    onError: (error) => {
      console.info(error.response.data)
      // Swal.fire('Error!', 'Error', 'error')
    },
  })

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
    if (ref.name === 'office') {
      accountableOfficerOffice.mutate(selectedOption ? selectedOption.value : '')
    }
  }
  const accountableOfficerOffice = useMutation({
    mutationFn: async (values) => {
      return await api.get('office/get_accountable_officer/' + values)
    },
    onSuccess: async (response) => {
      return response.data
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  return (
    <>
      <ToastContainer />
      <PageTitle pageTitle={cardTitle} />
      <CCard>
        <CCardHeader>{cardTitle}</CCardHeader>
        <CCardBody>
          <CForm className="row g-3 mt-2" onSubmit={form.handleSubmit}>
            <CRow>
              <CCol md={12}>
                <CFormInput
                  type="date"
                  label={requiredField('Date')}
                  name="date"
                  onChange={handleInputChange}
                  value={form.values.date}
                  placeholder="Date"
                />
                {form.touched.date && form.errors.date && (
                  <CFormText className="text-danger">{form.errors.date}</CFormText>
                )}
              </CCol>
              <CCol md={12}>
                <CFormLabel>{requiredField('Office')}</CFormLabel>

                <Select
                  ref={officeInputRef}
                  value={
                    !motorVehicleReport.isLoading &&
                    motorVehicleReport.data?.find((option) => option.value === form.values.office)
                  }
                  onChange={handleSelectChange}
                  options={!motorVehicleReport.isLoading && motorVehicleReport.data}
                  name="office"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />

                {form.touched.office && form.errors.office && (
                  <CFormText className="text-danger">{form.errors.office}</CFormText>
                )}
              </CCol>
              <CCol md={12}>
                <CFormSelect
                  label={requiredField('Accountable Officer')}
                  name="accountable_officer"
                  onChange={handleInputChange}
                  value={form.values.accountable_officer}
                >
                  <option value="">Select</option>
                  {!accountableOfficerOffice.isPending &&
                    accountableOfficerOffice?.data?.data.map((item, index) => (
                      <option key={index} value={item.id}>
                        {`${item.last_name}, ${item.first_name} ${item.middle_name} ${item.suffix}`.trim()}
                      </option>
                    ))}
                </CFormSelect>

                {form.touched.accountable_officer && form.errors.accountable_officer && (
                  <CFormText className="text-danger">{form.errors.accountable_officer}</CFormText>
                )}
              </CCol>
            </CRow>
            <hr />
            <CRow>
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  Generate
                </CButton>
              </CCol>
            </CRow>
          </CForm>

          {report.isPending && <DefaultLoading />}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Report
