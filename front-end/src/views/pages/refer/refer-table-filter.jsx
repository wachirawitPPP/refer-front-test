import { useState, useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';
import { IconButton, InputAdornment } from '@mui/material';
import CustomTextField from '@core/components/mui/TextField';
import AddReferModal from '@/app/[lang]/(dashboard)/pages/refer/Add-Refer-Modal';
import DatePicker from "react-datepicker";
const TableFilters = ({ setData, tableData }) => {
  const [urgent, setUrgent] = useState(4);
  const [status, setStatus] = useState("4");
  const [name, setName] = useState(""); 
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10))
  const [addModal, setAddModal] = useState(false);
  //console.log("Date Now", date)
  const handleSearch = () => {
    const filteredData = tableData?.filter(user => {
      const matchesUrgent = urgent === 4 || user.urgent === urgent // Show all if urgent is 4
      const matchesName = name === '' || user.name?.toLowerCase().includes(name.toLowerCase()) // Filter by name if provided
      const matchStatus = status === "4" || user.status === status; 
      const matchesDate = !date || user.referDate.substring(0, 10) === new Date(date).toISOString().substring(0,10);
      
      return matchesUrgent && matchesName && matchesDate && matchStatus // Filter by urgent, name, and date
    })
    //console.log(new Date(date).toISOString().substring(0,10))

    setData(filteredData)
  };

  useEffect(() => {

    //filter bydate to day
    const filteredData = tableData?.filter(user => {
      const matchStatus = status === "4" || user.status === status;
      const matchesDate = !date || new Date(user.referDate).toDateString() === new Date(date).toDateString() // Filter by exact date
       
      return matchesDate &&  matchStatus  
    })

    setData(filteredData)
  }, [urgent, name, date, tableData, setData,]);

  const resetFilters = () => {
    setUrgent(4);
    setStatus("4");
    setName("");
    setDate(null);
    setData(tableData);
  };

  const OpenModalAddRefer = () => {
    setAddModal(true);
  };

  return (
    <>
      <div className='flex flex-col justify-center z-50'>
        <div className='relative border border-gray-300 rounded-lg p-4 mb-4'>
          <span className='absolute -top-3 left-4 bg-white px-2 text-gray-500 text-sm'>
            <i className='tabler-search text-xs' /> ค้นหาด้วย
          </span>
          <div className='flex flex-col justify-center'>
            <div className='flex flex-col sm:flex-row w-full gap-4 pb-4 justify-center z-50'>
              <Grid className='w-full sm:w-3/12'>
                <CustomTextField
                  select
                  fullWidth
                  size='small'
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
              <Grid className='w-full sm:w-3/12'>
                <CustomTextField
                  select
                  fullWidth
                  size='small'
                  label='สถานะ'
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value={'4'}>ทั้งหมด</MenuItem>
                  <MenuItem value={'1'}>รอรับปรึกษา</MenuItem>
                  <MenuItem value={'2'}>ตอบรับปรึกษาแล้ว</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid className='w-full sm:w-3/12'>
                <CustomTextField
                  fullWidth
                  size='small'
                  label='ชื่อ-นามสกุล'
                  placeholder='ชื่อ-นามสกุล'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Grid>
              <Grid className='w-full sm:w-3/12'>
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
              <Grid className='w-full sm:w-1/12'>
                <Button variant='tonal' style={{ marginTop: '1.3rem' }} size='small' onClick={handleSearch} fullWidth>
                  <i className='tabler-search' />
                  ค้นหา
                </Button>
              </Grid>
              <Grid className='w-full sm:w-3/12 md:w-6/6'>
                <Button
                  color='primary'
                  style={{ whiteSpace: 'nowrap' }}
                  className='sm:mt-5'
                  size='medium'
                  variant='contained'
                  fullWidth
                  startIcon={<i className='tabler-plus' />}
                  onClick={OpenModalAddRefer}
                >
                  ส่งปรึกษา
                </Button>
              </Grid>
              <AddReferModal open={addModal} onClose={() => setAddModal(false)} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default TableFilters;
