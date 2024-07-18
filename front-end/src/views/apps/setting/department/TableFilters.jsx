// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const TableFilters = ({ setData, tableData }) => {
  
  // States
  const [isActive, setIsActive] = useState('')

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (isActive === '') return true; // Show all users if no filter is applied
      return user.isActive === (isActive === 1); // Compare with boolean value
    })

    setData(filteredData)
  }, [isActive, tableData, setData])

  const resetFilters = () => {
    setIsActive('')
    setData(tableData)
  }

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            
            select
            fullWidth
            id='select-status'
            value={isActive}
            onChange={e => setIsActive(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>เลือกสถานะ</MenuItem>
            <MenuItem value={1} >ใช้งาน</MenuItem>
            <MenuItem value={0}>ระงับ</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" size='md' color="primary" onClick={resetFilters}>
          <i className='tabler-refresh' />
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
