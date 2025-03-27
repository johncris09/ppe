import React, { useRef, useState } from 'react'
import * as Yup from 'yup'
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate'
import Select from 'react-select'
import './../../assets/css/custom.css'
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
  CFormSelect,
  CFormText,
  CRow,
} from '@coreui/react'
import { useFormik } from 'formik'
import { ToastContainer } from 'react-toastify'
import { api, DefaultLoading, requiredField } from 'src/components/SystemConfiguration'
import { useMutation, useQuery } from '@tanstack/react-query'
import PageTitle from 'src/components/PageTitle'
import Swal from 'sweetalert2'

const Report = ({ cardTitle }) => {
  const officeInputRef = useRef()

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
      date: '2025-03-25',
      office: '14',
      accountable_officer: '1',
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

            Object.entries(response.data).forEach(([equipment_type, row]) => {
              const equipmentType = `${row.equipment_type} (${row.code})`
              const sheet = workbook.addSheet(shortenSheetName(equipmentType))

              sheet.column('A').width(18)
              sheet.column('B').width(45)
              sheet.column('C').width(15)
              sheet.column('D').width(9)
              sheet.column('E').width(15)
              sheet.column('F').width(22)
              sheet.column('G').width(11)
              sheet.column('I').width(9)
              sheet.column('J').width(12)
              sheet.column('K').width(25)

              sheet.column('A').style({ wrapText: true })
              sheet.column('B').style({ wrapText: true })
              sheet.column('K').style({ wrapText: true })

              let rowStart = 1
              let pageInformation = 10
              row.items.forEach((item, index) => {
                // Page Information
                item.pageInformation.forEach((page) => {
                  sheet
                    .range(`B${rowStart}:J${rowStart}`)
                    .merged(true)
                    .value(page.title)
                    .style({ horizontalAlignment: 'center', bold: true, fontSize: 10 })

                  sheet
                    .cell(`K${rowStart}`)
                    .value(page.annex)
                    .style({ horizontalAlignment: 'center', fontSize: 8 })

                  sheet
                    .range(`B${rowStart + 1}:J${rowStart + 1}`)
                    .merged(true)
                    .value(page.equipmentType)
                    .style({
                      horizontalAlignment: 'center',
                      underline: true,
                      bold: true,
                      fontSize: 10,
                    })
                  sheet
                    .range(`B${rowStart + 2}:J${rowStart + 2}`)
                    .merged(true)
                    .value(page.typeTitle)
                    .style({ horizontalAlignment: 'center', fontSize: 9 })
                  sheet
                    .range(`B${rowStart + 3}:J${rowStart + 3}`)
                    .merged(true)
                    .value('As of ' + page.asOf)
                    .style({ horizontalAlignment: 'center', bold: true })
                  sheet.cell(`A${rowStart + 4}`).value('For which')
                  sheet
                    .cell(`G${rowStart + 4}`)
                    .value('is accountable, having assumed such accountability on')
                    .style({ fontSize: 8 })
                  sheet
                    .cell(`K${rowStart + 4}`)
                    .value(page.dateAssumption)
                    .style({
                      bold: true,
                      horizontalAlignment: 'center',
                      fontSize: 10,
                      border: {
                        bottom: { style: 'thin' }, // Adds a thin bottom border
                      },
                    })

                  sheet
                    .cell(`K${rowStart + 5}`)
                    .value('(Date  of  Assumption)')
                    .style({ bold: true, horizontalAlignment: 'center', fontSize: 10 })
                  sheet
                    .range(`B${rowStart + 4}:F${rowStart + 4}`)
                    .merged(true)
                    .value(
                      page.accountableOfficer + ' ' + page.office + ' City Government of Oroquieta',
                    )
                    .style({
                      bold: true,
                      border: {
                        bottom: { style: 'thick' },
                      },
                      wrapText: true,
                    })

                  sheet
                    .cell(`B${rowStart + 5}`)
                    .value('(Name  of Accountable  Officer)')
                    .style({ bold: true, fontSize: 9, wrapText: true })

                  sheet
                    .range(`C${rowStart + 5}:D${rowStart + 5}`)
                    .merged(true)
                    .value('(Official  Designation)')
                    .style({
                      bold: true,
                      fontSize: 9,
                      wrapText: true,
                    })
                  sheet
                    .cell(`F${rowStart + 5}`)
                    .value('LGU')
                    .style({ bold: true, fontSize: 9, wrapText: true })

                  sheet.range(`A${rowStart + 5}:K${rowStart + 5}`).style({
                    horizontalAlignment: 'center', // Center horizontally
                    verticalAlignment: 'top', // Align to the top
                  })

                  // Define column headers
                  sheet
                    .range(`A${rowStart + 7}:A${rowStart + 9}`)
                    .merged(true)
                    .value('ARTICLE')
                    .style({ wrapText: true })
                  sheet
                    .range(`B${rowStart + 7}:C${rowStart + 9}`)
                    .merged(true)
                    .value('DESCRIPTION')
                    .style({ wrapText: true })
                  sheet
                    .range(`D${rowStart + 7}:D${rowStart + 9}`)
                    .merged(true)
                    .value('STOCK NUMBER')
                    .style({ wrapText: true })
                  sheet
                    .range(`E${rowStart + 7}:E${rowStart + 9}`)
                    .merged(true)
                    .value('UNIT OF MEASURE')
                    .style({ wrapText: true })
                  sheet
                    .range(`F${rowStart + 7}:F${rowStart + 9}`)
                    .merged(true)
                    .value('UNIT VALUES')
                    .style({ wrapText: true })
                  sheet
                    .range(`G${rowStart + 7}:G${rowStart + 9}`)
                    .merged(true)
                    .value('BALANCE PER CARD (QTY)')
                    .style({ wrapText: true })
                  sheet
                    .range(`H${rowStart + 7}:H${rowStart + 9}`)
                    .merged(true)
                    .value('ON HAND PER COUNT (QTY)')
                    .style({ wrapText: true })
                  sheet
                    .range(`I${rowStart + 7}:J${rowStart + 8}`)
                    .merged(true)
                    .value('SHORTAGE/OVERAGE')
                    .style({ wrapText: true })
                  sheet.cell(`I${rowStart + 9}`).value('QTY') // Sub-header
                  sheet.cell(`J${rowStart + 9}`).value('VALUE') // Sub-header
                  sheet
                    .range(`K${rowStart + 7}:K${rowStart + 9}`)
                    .merged(true)
                    .value('REMARKS')

                  // Apply styles
                  sheet.range(`A${rowStart + 7}:K${rowStart + 9}`).style({
                    bold: true,
                    horizontalAlignment: 'center',
                    verticalAlignment: 'center',
                    border: true,
                  })
                })

                rowStart += pageInformation
                let itemRow = 1
                let newLineCount = 0
                item.equipments.forEach((equipment) => {
                  let value = parseFloat(equipment.value)
                  let formatNumber = value.toLocaleString('en-US', { minimumFractionDigits: 2 })
                  newLineCount += (equipment.description.match(/\n/g) || []).length + 1

                  sheet
                    .cell(`A${rowStart - 1 + itemRow}`)
                    .value(equipment.article)
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
                    .cell(`B${rowStart - 1 + itemRow}`)
                    .value(equipment.description)
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
                    .cell(`C${rowStart - 1 + itemRow}`)
                    .value(equipment.date_acquired)
                    .style({
                      verticalAlignment: 'top',
                      horizontalAlignment: 'right',
                      border: {
                        top: { style: 'thin', color: 'black' },
                        bottom: { style: 'thin', color: 'black' },
                        right: { style: 'thin', color: 'black' },
                      },
                    })
                  sheet
                    .cell(`D${rowStart - 1 + itemRow}`)
                    .value(equipment.stock_number)
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
                    .cell(`E${rowStart - 1 + itemRow}`)
                    .value(equipment.unit)
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
                    .cell(`F${rowStart - 1 + itemRow}`)
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
                    .cell(`G${rowStart - 1 + itemRow}`)
                    .value(equipment.balance_per_card)
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
                    .cell(`H${rowStart - 1 + itemRow}`)
                    .value(equipment.onhand_per_count)
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
                    .cell(`I${rowStart - 1 + itemRow}`)
                    .value(equipment.shortage_quantity)
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
                    .cell(`J${rowStart - 1 + itemRow}`)
                    .value(equipment.storage_value)
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

                  const remarks = equipment.remarks ? `\n${equipment.remarks}` : ''

                  sheet
                    .cell(`K${rowStart - 1 + itemRow}`)
                    .value(`${equipment.end_user}${remarks}`) // Add newline between values
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
                  itemRow++
                })
                rowStart += newLineCount
              })
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
            // a.download = selectedOffice.abbr + ' - PPE ' + formattedDate + '.xlsx'
            a.download = 'PPE.xlsx'
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
                    accountableOfficerOffice?.data?.data.map((item, index) => {
                      const fullName = [
                        item.last_name,
                        item.first_name,
                        item.middle_name || '', // Exclude null values
                        item.suffix || '', // Exclude null values
                      ]
                        .filter(Boolean) // Remove empty strings
                        .join(' ') // Join with spaces

                      return (
                        <option key={index} value={item.id}>
                          {fullName}
                        </option>
                      )
                    })}
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
