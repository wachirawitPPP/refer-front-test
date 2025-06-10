import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import React from 'react'

const Observation = ({ data }) => {
  // Define table header fields
  const fields = [
    { label: 'OBSERVATION', value: 'OBL_OBSERVATION_IDENTIFIER_NAME' },
    { label: 'VALUE', value: 'OBL_OBSERVATION_VALUE' },
    { label: 'UNIT', value: 'OBL_UNITS' },
    { label: 'REF.LOW / REF.HIGH', value: 'OBL_REFERENCE_RANGES' }
  ]

  // Function to format PROCEDURE_DATETIME
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

  // Function to concatenate min and max values from OBL_REFERENCE_RANGES
  const formatReferenceRanges = ranges => {
    if (!ranges) return '-' // Return a default value if ranges is empty or undefined
  
    // Clean the string by removing "Min", "Max", and "/"
    let cleanedString = ranges.replace(/Min|Max|\//g, '').trim()
    // Split the string into min and max values
    let [minValue, maxValue] = cleanedString.split(' ').filter(Boolean)
  
    // If min or max is missing, return only the available value
    if (minValue && maxValue) {
      return `${minValue} - ${maxValue}` // Both values exist, show in "min - max" format
    } else if (minValue) {
      return minValue // Only min value exists
    } else if (maxValue) {
      return maxValue // Only max value exists
    } else {
      return '-' // Neither value exists
    }
  }
  

  // const inputString = ' Min 0.50/ Max 0.90'
  // let cleanedString = inputString.replace(/Min|Max|\//g, '').trim()
  // let [minValue, maxValue] = cleanedString.split(' ').filter(Boolean)
  // console.log('Min Value:', minValue)
  // console.log('Max Value:', maxValue)

  return (
    <Grid item xs={12} md={12}>
      <TableContainer component={Paper} className='overflow-y-auto max-h-[40vh]'>
        <Table stickyHeader aria-label='observations table'>
          <TableHead>
            <TableRow>
              {/* Render table headers */}
              {fields.map((field, index) => (
                <TableCell key={index} className='text-white bg-primary whitespace-nowrap '>
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
                  <TableCell key={index}>
                    {/* Display formatted PROCEDURE_DATETIME or other fields */}
                    {field.value === 'OBL_OBSERVATION_DATE_TIME'
                      ? formatDateTime(rowData[field.value])
                      : field.value === 'OBL_REFERENCE_RANGES'
                        ? formatReferenceRanges(rowData[field.value]) // Format reference ranges
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

export default Observation
