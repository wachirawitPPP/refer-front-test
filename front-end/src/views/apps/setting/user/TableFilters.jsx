// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const TableFilters = ({ setData, tableData }) => {
  // States
  const [role, setRole] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (role && user.role !== role) return false
      if (department && user.department !== department) return false
      if (status && user.status !== status) return false

      return true
    })

    setData(filteredData)
  }, [role, department, status, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={3}>
          <CustomTextField
            select
            fullWidth
            id='select-role'
            value={role}
            onChange={e => setRole(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>เลือกตำแหน่ง</MenuItem>
            <MenuItem value='doctor'>แพทย์</MenuItem>
            <MenuItem value='refer-doctor'>แพทย์ส่งตัว</MenuItem>
            <MenuItem value='nurse'>พยาบาล</MenuItem>
         
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <CustomTextField
            select
            fullWidth
            id='select-plan'
            value={department}
            onChange={e => setDepartment(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>เลือกหน่วยงาน / แผนก</MenuItem>
            <MenuItem value='department 1'>department1</MenuItem>
            <MenuItem value='department 2'>department2</MenuItem>
            <MenuItem value='department 3'>department3</MenuItem>
            <MenuItem value='department 3'>department3</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={status}
            onChange={e => setStatus(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>เลือกสถานะบัญชี</MenuItem>
            <MenuItem value='active'>ใช้งาน</MenuItem>
            <MenuItem value='inActive'>ระงับ</MenuItem>
           
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
