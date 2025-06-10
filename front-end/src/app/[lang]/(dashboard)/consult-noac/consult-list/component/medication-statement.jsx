import { Card, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import React from 'react'

// med_unit is already provided as part of your data
const med_unit = [
  { id: '1', name: 'กระป๋อง' },
  { id: '2', name: 'กระปุก' },
  { id: '3', name: 'กล่อง' },
  { id: '4', name: 'ก้อน' },
  { id: '5', name: 'แกลลอน' },
  { id: '6', name: 'ขวด' },
  { id: '7', name: 'คาทริดจ์' },
  { id: '8', name: 'คู่' },
  { id: '9', name: 'แคปซูล' },
  { id: '10', name: 'ชิ้น' },
  { id: '11', name: 'ชุด' },
  { id: '12', name: 'ชุดทดสอบ' },
  { id: '13', name: 'ซอง' },
  { id: '14', name: 'ด้าม' },
  { id: '15', name: 'ตลับ' },
  { id: '16', name: 'ถัง' },
  { id: '17', name: 'ถุง' },
  { id: '18', name: 'แถบ' },
  { id: '19', name: 'ท่อ' },
  { id: '20', name: 'แท่ง' },
  { id: '21', name: 'แทงค์' },
  { id: '22', name: 'ใบ' },
  { id: '23', name: 'ปี๊บ' },
  { id: '24', name: 'แผง' },
  { id: '25', name: 'แผ่น' },
  { id: '26', name: 'ม้วน' },
  { id: '27', name: 'เม็ด' },
  { id: '28', name: 'ลิตร' },
  { id: '29', name: 'ไวอัล' },
  { id: '30', name: 'เส้น' },
  { id: '31', name: 'หลอด' },
  { id: '32', name: 'หัว' },
  { id: '33', name: 'โหล' },
  { id: '34', name: 'อัน' },
  { id: '35', name: 'แอมพูล' }
]

const MedicationStatement = ({ data }) => {
  // Define table header fields
  const fields = [
    { label: 'ชื่อยา', value: 'RXO_DRUG_NAME' },
    { label: 'จำนวน', value: 'RXO_TOTAL_USAGE' },
    { label: 'หน่วยของยา', value: 'RXO_DRUG_UNITS' },
    { label: 'วิธีใช้ยา', value: 'RXO_PROVIDERS_PHARMACY_TREATMENT_INSTRUCTIONS' },
  ]

  // Helper function to find the unit name by ID
  const getUnitNameById = id => {
    console.log(id)
    const unit = med_unit.find(unit => unit.id === id)
    return unit ? unit.name : 'Unknown Unit'
  }

  const formatDateTime = datetime => {
    if (!datetime) return ''

    const year = datetime.slice(0, 4)
    const month = datetime.slice(4, 6)
    const day = datetime.slice(6, 8)
    const hour = datetime.slice(8, 10)
    const minute = datetime.slice(10, 12)
    const second = datetime.slice(12, 14)

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`
  }

  return (
    <Grid item xs={12} md={12}>
      <TableContainer component={Paper} className='overflow-y-auto max-h-[40vh]'>
        <Table stickyHeader aria-label='observations table'>
          <TableHead>
            <TableRow>
              {/* Render table headers */}
              {fields.map((field, index) => (
                <TableCell key={index} align={'center'} className='text-white bg-primary whitespace-nowrap '>
                  {field.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render table rows dynamically based on the data */}
            {data.map((rowData, rowIndex) => (
              <TableRow key={rowIndex}>
                {fields.map((field, index) => (
                  <TableCell key={index} align={field.value === 'RXO_TOTAL_USAGE' ? 'center' : 'left'}>
                    {/* Handle the RXO_DOSAGE_UNITS field with the unit name mapping */}
                    {field.value === 'RXO_DRUG_UNITS'
                      ? `${getUnitNameById(String(rowData[field.value]).trim())}`
                      : field.value === 'OBL_OBSERVATION_DATE_TIME'
                        ? formatDateTime(rowData[field.value])
                        : rowData[field.value] || '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  )
}

export default MedicationStatement
