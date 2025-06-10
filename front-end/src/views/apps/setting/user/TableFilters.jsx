// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import AddUserDrawer from './AddUserDrawer';
const TableFilters = ({ setData, tableData }) => {
  // States
  const [role, setRole] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState(true)
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    handleSearch()
    console.log(status)
  }, [role, department, status, tableData, setData])

  const handleSearch = () => {
    const filteredData = tableData?.filter(user => {
      const matchRole = role === "" || user.role === role; // Show all if urgent is 4
      const matchesDepartment = department === "" || user.department === department; // Filter by name if provided

      // Assuming `user.birthDate` is in a Date-compatible format
      const matchStatus = status === null || user.isActive === status;

      return matchRole && matchesDepartment && matchStatus; // Filter by urgent, name, and date
    });

    setData(filteredData);
  }

  const handleAdduser = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className='flex flex-col justify-center'>
        <div className='flex flex-col sm:flex-row w-full gap-4 py-4 justify-center'>
          <Grid className="w-full sm:w-3/12">
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
              <MenuItem value='nurse'>พยาบาล</MenuItem>
              <MenuItem value='regist'>ห้องบัตร</MenuItem>

            </CustomTextField>
          </Grid>
          <Grid className="w-full sm:w-3/12">
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
          <Grid className="w-full sm:w-3/12">
            <CustomTextField
              select
              fullWidth
              id='select-status'
              value={status}
              onChange={e => setStatus(e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value={true}>ใช้งาน</MenuItem>
              <MenuItem value={false}>ระงับ</MenuItem>

            </CustomTextField>
          </Grid>
          <Grid className="w-full sm:w-2/12">
            <Button variant="contained" size='small' color="primary" onClick={handleSearch} fullWidth >
              <i className='tabler-search' />ค้นหา
            </Button>
          </Grid>
          <Grid className='w-full sm:w-2/12'> 
          <Button variant="contained" size='small' color="primary" fullWidth onClick={() => handleAdduser()}>
              <i className='tabler-user-plus' />เพิ่มผู้ใช้งาน
            </Button>
          </Grid>
        </div>
        <div className='flex flex-col sm:flex-row justify-center gap-4'>
         
          {/* <Grid className="w-full sm:w-1/12">
            <Button variant="contained" size='small' color="warning" onClick={resetFilters} fullWidth >
              <i className='tabler-refresh' />
            </Button>
          </Grid> */}

        </div>

      </div>

      <AddUserDrawer  
         open={isModalOpen}
         onClose={() => setModalOpen(false)}
         isEdit={isEdit} 
      />

      <CardContent>
        <Grid container spacing={6}>

         
         
        </Grid>
      </CardContent>
    </>
  )
}

export default TableFilters
