import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import React from 'react'

const DiagnosticList = ({ data }) => {
  const priorityConvert = priority => {
    if (priority === '1') return 'PRINCIPLE DX (การวินิจฉัยโรคหลัก)'
    else if (priority === '2') return 'CO-MORBIDITY (การวินิจฉัยโรคร่วม)'
    else if (priority === '3') return 'COMPLICATION (การวินิจฉัยโรคแทรก)'
    else if (priority === '4') return 'OTHER (อื่น ๆ)'
    else if (priority === '5') return 'EXTERNAL CAUSE (สาเหตุภายนอก)'
    else return ''
  }

  // Define table header fields
  const fields = [
    { label: 'รหัสโรค', value: 'DG1_DISEASE_CODE' },
    { label: 'ชื่อ', value: 'DG1_DISEASE_TEXT' },
    { label: 'ประเภท', value: 'DG1_DIAGNOSIS_PRIORITY' },

  ]

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
      <TableContainer component={Paper} className='overflow-y-auto max-h-[90vh]'>
        <Table stickyHeader aria-label='observations table'>
          <TableHead>
            <TableRow>
              {/* Render table headers */}
              {fields.map((field, index) => (
                <TableCell 
                  key={index} 
                  align={'center'} // Conditionally center 'PR1_MORE_DETAIL'
                  className='text-white bg-primary whitespace-nowrap'>
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
                  <TableCell
                          
                    key={index} 
                    align={field.value === 'DG1_DISEASE_CODE' ? 'center' : 'left'} // Conditionally center 'PR1_MORE_DETAIL'
                  >
                   {field.value === 'DG1_DATETIME_UPDATE'
                        ? formatDateTime(rowData[field.value])
                        : field.value === 'DG1_DIAGNOSIS_PRIORITY'
                          ? priorityConvert(rowData[field.value])
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

export default DiagnosticList
