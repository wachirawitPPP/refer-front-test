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
  const [name, setName] = useState("");

  const handleSearch = async () => {
    const filteredData = tableData?.filter(user => {
      const matchesName = name === "" || user.firstnameTH?.toLowerCase().includes(name.toLowerCase()) || user.lastnameTH?.toLowerCase().includes(name.toLowerCase());
      const matchStatus = isActive === "" || user.isActive === isActive
      return matchesName && matchStatus
    })

    setData(filteredData)
  }

  // useEffect(() => {

  // }, [isActive, tableData, setData])

  const resetFilters = () => {
    setIsActive('')
    setName('')
    setData(tableData)
    // handleSearch()
  }

  return (
    <>
      <div className='flex flex-col justify-center'>
        <div className='flex flex-col sm:flex-row w-full gap-4 py-2 justify-center'>
          <Grid className="w-full sm:w-3/12">
            <CustomTextField
              className="w-full"
              select
              id='select-status'
              value={isActive}
              onChange={e => setIsActive(e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value=''>เลือกสถานะ</MenuItem>
              <MenuItem value={true} >ใช้งาน</MenuItem>
              <MenuItem value={false}>ระงับ</MenuItem>
            </CustomTextField>
          </Grid>

          <Grid className="w-full sm:w-3/12">
            <CustomTextField
              fullWidth
              size='small'
              placeholder="ชื่อ-นามสกุล"
              id='filter-name'
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Grid>

          <Grid className="w-full sm:w-1/12">
            <Button variant="contained" size='small' color="primary" onClick={handleSearch} fullWidth>
              <i className='tabler-search' />
            </Button>
          </Grid>
          <Grid className="w-full sm:w-1/12">
            <Button variant="contained" size='small' color="warning" onClick={resetFilters} fullWidth>
              <i className='tabler-refresh' />
            </Button>
          </Grid>

        </div>

      </div>

    </>
    // <CardContent>
    //   <Grid container spacing={6}>
    //     <Grid item >
    //       <CustomTextField
    //         className="w-full"
    //         select
    //         id='select-status'
    //         value={isActive}
    //         onChange={e => setIsActive(e.target.value)}
    //         SelectProps={{ displayEmpty: true }}
    //       >
    //         <MenuItem value=''>เลือกสถานะ</MenuItem>
    //         <MenuItem value={true} >ใช้งาน</MenuItem>
    //         <MenuItem value={false}>ระงับ</MenuItem>
    //       </CustomTextField>
    //     </Grid>
    //     <Grid item>
    //       <CustomTextField
    //         fullWidth
    //         placeholder="ชื่อ-นามสกุล"
    //         id='filter-name'
    //         value={name}
    //         onChange={e => setName(e.target.value)}
    //       />
    //     </Grid>
    //     <Grid item >
    //       <Button variant="contained" size='md' color="primary" onClick={handleSearch}>
    //         <i className='tabler-search' />
    //       </Button>
    //     </Grid>
    //     <Grid item >
    //       <Button variant="contained" size='md' color="warning" onClick={resetFilters}>
    //         <i className='tabler-refresh' />
    //       </Button>
    //     </Grid>

    //   </Grid>
    // </CardContent>
  )
}

export default TableFilters
