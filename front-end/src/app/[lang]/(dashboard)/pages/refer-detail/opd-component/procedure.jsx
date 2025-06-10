import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import React from 'react'

const Procedure = ({ data }) => {
  // Define table header fields
  const fields = [
    { label: 'ชื่อ', value: 'PROCEDURE_NAME' },
    { label: 'รายละเอียด', value: 'PR1_MORE_DETAIL' },
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
      <TableContainer component={Paper} className='overflow-y-auto max-h-[60vh]'>
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
                    align={field.value === 'PR1_MORE_DETAIL' ? 'center' : 'left'} // Conditionally center 'PR1_MORE_DETAIL'
                  >
                    {rowData[field.value] || '-'}
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

export default Procedure
