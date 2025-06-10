import { useState, useEffect } from 'react'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { IconButton, InputAdornment } from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'
const PendingReferTableFilter = ({ setData, tableData }) => {
  // States
  const [urgent, setUrgent] = useState(4)
  const [name, setName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10)) // Manage date selection
  const [valuedate, setValuedate] = useState(null)
  const [status, setStatus] = useState("4")
 
  const handleSearch = () => {
    const filteredData = tableData?.filter(user => {
      const matchesUrgent = urgent === 4 || user.urgent === urgent // Show all if urgent is 4
      const matchesName = name === '' || user.name?.toLowerCase().includes(name.toLowerCase()) // Filter by name if provided
      const matchStatus = status === "4" || user.status === status;
      // Assuming `user.birthDate` is in a Date-compatible format
      const matchesDate = !date || user.referDate.substring(0, 10) === new Date(date).toISOString().substring(0,10);
      
      return matchesUrgent && matchesName && matchesDate && matchStatus // Filter by urgent, name, and date
    })
    console.log(new Date(date).toISOString().substring(0,10))

    setData(filteredData)
  }

  useEffect(() => {

    //filter bydate to day
    const filteredData = tableData?.filter(user => {
      const matchesDate = !date || new Date(user.referDate).toDateString() === new Date(date).toDateString() // Filter by exact date
      return matchesDate
    })

    setData(filteredData)
  }, [urgent, name, date, tableData, setData,]);

  const resetFilters = () => {
    setUrgent(4)
    setName('')
    setDate(null) // Reset date filter
    setData(tableData)
  }

  return (
    <>
      <div className='flex flex-col z-50'>
        <div className="relative border border-gray-300 rounded-lg p-4">
          <span className="absolute -top-3 left-4 bg-white px-2 text-gray-500 text-sm"><i className='tabler-search text-xs' /> ค้นหาด้วย</span>
          <div className='flex flex-wrap w-full gap-2  justify-center'>
            {/* Urgency */}
            <Grid className='w-full sm:w-1/5'>
              <CustomTextField
                select
                fullWidth
                size='small'
                id='select-urgent'
                label='ความเร่งด่วน'
                value={urgent}
                onChange={e => setUrgent(e.target.value)}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value={4}>ทั้งหมด</MenuItem>
                <MenuItem value={2}>Emergency</MenuItem>
                <MenuItem value={1}>Urgent</MenuItem>
                <MenuItem value={0}>Elective</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Status */}
            <Grid className='w-full sm:w-1/5'>
              <CustomTextField
                select
                fullWidth
                size='small'
                id='select-status'
                label='สถานะ'
                value={status}
                onChange={e => setStatus(e.target.value)}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value={"4"}>ทั้งหมด</MenuItem>
                <MenuItem value={'1'}>รอรับปรึกษา</MenuItem>
                <MenuItem value={'2'}>ตอบรับปรึกษาแล้ว</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Name */}
            <Grid className='w-full sm:w-1/5'>
              <CustomTextField
                fullWidth
                size='small'
                label='ชื่อ-นามสกุล'
                placeholder='ชื่อ-นามสกุล'
                id='filter-name'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Grid>

            {/* Date Picker */}
            <Grid className='w-full sm:w-1/5'> 
              <AppReactDatepicker
                selected={date} 
                id='birthDate-input'
                label='วันที่'
                onChange={setDate}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                showMonthDropdown
                placeholderText='วันที่สร้างรายการ'
                required
                className="z-100"
                popperProps={{
                  modifiers: [
                    {
                      name: 'zIndex',
                      enabled: true,
                      options: {
                        zIndex: 100,
                      },
                    },
                  ],
                }}
                customInput={
                  <CustomTextField
                    fullWidth
                    label='วันที่'
                    size='small'
                    onChange={e => setValuedate(e.target.value)}
                    InputProps={{
                      endAdornment: date && (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='clear date'
                            onClick={() => setDate(null)}
                            edge='end'
                          >
                            x
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                }
              />
            </Grid>

            {/* Search Button */}
            <Grid className='w-full sm:w-1/12'>
              <Button
                variant="tonal"
                size='small'
                style={{marginTop:'1.25rem'}}
                color="primary"
                onClick={handleSearch}
                fullWidth
              >
                <i className='tabler-search' />ค้นหา
              </Button>
            </Grid>

            {/* Reset Button */}
            {/* <Grid className='w-full sm:w-1/12'>
        <Button
          variant='contained'
          size='small'
          color='warning'
          onClick={resetFilters}
          fullWidth
        >
          <i className='tabler-refresh' />
        </Button>
      </Grid> */}
          </div>
        </div>
      </div>

    </>
  )
}

export default PendingReferTableFilter
