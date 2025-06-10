'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, MenuItem } from '@mui/material'

// import UploadFiles from './upload'
// import CreateProfile from './createProfile'
// import PhysicalExamination from './physicalExamination'
import relation from '@/data/relation.json'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { toast } from 'react-toastify'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import Typography from '@mui/material/Typography'

import axios from 'axios'

import { useSession } from 'next-auth/react'
const currentDate = new Date().toISOString()
const initialFormValue = {
  // CreateProfile
  weight: '',
  height: '',
  BMI: '',
  temperature: '',
  pulse: '',
  breathing: '',
  pressure: '',
  systonic: '',
  diastolic: '',
  o2sat: '',
  bsa: '',
  vas: '',
  basicDrink: '1',
  basicSmoke: '1',
  // basicPlane: "สามารถขึ้นเครื่องบินได้",
  //แถบฝั่งซ้าย
  diagnosisList: [],
  cc: '',
  hpi: '',
  pmh: '',
  dx: '',
  IOPatLE: '',
  IOPatRE: '',
  VAccLE: '',
  VAccRE: '',
  VAscLE: '',
  VAscRE: '',
  ga: '',
  pe: '',
  docNote: '',
  file: [],
  docName: 'นายแพทย์ถานไถ จิ้น',
  hn: '0001',
  customer_id: '1',
  department_id: '1',
  opd_code: 'test1234',
  opd_date: currentDate
}

const initialFormDiagnotis = {
  diagnostic_id: '',
  opd_id: '',
  diagnostic_code: '',
  diagnostic_th: '',
  diagnostic_en: '',
  diagnostic_detail: ''
}




const OpdDetailComponent = ({ title, open, onClose, isViewOnly, tableData, dataEditOpd,onUpdate }) => {
  console.log(dataEditOpd);
  // States
  const [value, setValue] = useState('1')
  const [formValues, setFormValues] = useState(initialFormValue)
  const [DiagnoticForm, setDiagnoticForm] = useState(initialFormDiagnotis)
  const [files, setFiles] = useState([])
  const [sendData, setSendData] = useState(false)
  const { data: session, status } = useSession()
  const [department, setDepartment] = useState('')
  const [Pattient_type, setPattient_type] = useState('OPD')
  const [data, setData] = useState(tableData)
  const [dataEditOpds, setDataEditOpds] = useState(dataEditOpd)

  

//   useEffect(() => {
//     if (title === 'เพิ่มการซักประวัติ') {
//       setFormValues(initialFormValue)
//     } else {
//       setFormValues(MockData)
//     }
//     console.log("DataEditOpd", dataEditOpd)
//     const filteredData = tableData?.filter(user => {
//       if (department && user.department !== department) return false

//       return true
//     })

//     setData(filteredData)

//     setFiles([])
//   }, [title, open, onClose, department, tableData, dataEditOpd])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const requirfields = [
    'weight',
    'height',
    'BMI',
    'temperature',
    'pulse',
    'breathing',
    'pressure',
    'systonic',
    'diastolic ',
    'o2sat',
    'bsa',
    'vas',
    'basicDrink',
    'basicSmoke',
    'IOPatLE',
    'IOPatRE',
    'VAccLE',
    'VAccRE',
    'VAscLE',
    'VAscRE',
    'ga',
    'pe',
    'docNote'
  ]
  const isFormIncomplete = requirfields.some(field => !formValues[field])

  const submitForm = async () => {
    const formData = {
      opd_weight: parseInt(formValues.weight),
      opd_height: parseInt(formValues.height),
      opd_bmi: formValues.BMI,
      opd_temperature: formValues.temperature,
      opd_pressure: formValues.pressure,
      opd_systonic: formValues.systonic,
      opd_diastolic: formValues.diastolic,
      opd_o2sat: formValues.o2sat,
      opd_bsa: formValues.bsa,
      opd_vas: formValues.vas,
      opd_alcohol: formValues.basicDrink,
      opd_fag: formValues.basicSmoke,
      //opd_diagnosisList: formValues.diagnosisList,
      opd_cc: formValues.cc,
      opd_hpi: formValues.hpi,
      opd_pmh: formValues.pmh,
      opd_dx: formValues.dx,
      opd_IOPatLE: formValues.IOPatLE,
      opd_IOPatRE: formValues.IOPatRE,
      opd_VAccLE: formValues.VAccLE,
      opd_VAccRE: formValues.VAccRE,
      opd_VAscLE: formValues.VAscLE,
      opd_VAscRE: formValues.VAscRE,
      opd_ga: formValues.ga,
      opd_pe: formValues.pe,
      opd_pe: formValues.pe,
      opd_docNote: formValues.docNote,
      opd_docName: formValues.docName,
      hn: formValues.hn,
      pattient_type: Pattient_type,
      customer_id: parseInt(formValues.customer_id),
      department_id: parseInt(formValues.department_id),
      opd_code: formValues.opd_code,
      opd_date: formValues.opd_date
    }

    console.log(formValues, 'submit')
    console.log(formData, 'formData')
    console.log(Pattient_type, 'Pattient_type')


    if (!formValues.weight && !formValues.BMI && !formValues.height) {
      toast.error('กรุณากรอกข้อมูลให้ครบ!');
      setSendData(true);
    } else {  
      try {
        const response1 = await axios.post(
          `${process.env.NEXT_PUBLIC_TEST_API_URL}/createopd`,
          {
            ...formData
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${session.user.token}`
            }
          }
        );
    
        if (response1.status === 201) {
          //******Form Diagnostics*******
          const DiagnosticsForm = [];
          const opdId = response1.data.lastId;
          formValues.diagnosisList.forEach(item => {
            console.log('item', item);
            const data = {
              diagnostic_id: item.diagnosisList.id,
              diagnostic_code: item.diagnosisList.diagnostics_code,
              diagnostic_th: item.diagnosisList.diagnostics_th,
              diagnostic_en: item.diagnosisList.diagnostics_en,
              opd_id: opdId
            };
            DiagnosticsForm.push(data);
          });
          console.log('data', DiagnosticsForm);
    
          const response2 = await axios.post(
            `${process.env.NEXT_PUBLIC_TEST_API_URL}/createopddiag`,
            DiagnosticsForm, 
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `${session.user.token}`
              }
            }
          );
    
          console.log(response2);
          onClose();
          toast.success('บันทึกข้อมูลสำเร็จ!');
          setSendData(false);
          setValue('1');
        } else {
          console.log('response1', response1);
          toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล OPD!');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล!');
        setSendData(false);
      }
    }
  }

  const onCloseModal = () => {
    setFormValues(initialFormValue)
    setFiles([])
    onClose()
    setValue('1')
  }


  const mapData = relation.doctorName.map((item, index) => ({
    id: `${index + 1}`,
    title: item
  }))
  const handleChangeSelect = (event, newValue) => {
    setFormValues(prevValues => ({
      ...prevValues,
      docName: newValue ? newValue.title : ''
    }))
  }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onCloseModal
        }
      }}
      maxWidth='lg'
      fullWidth
    >
      <DialogTitle>
        <Grid container spacing={2}>
          <Grid item xs={6} md={4}>
            {title}
          </Grid>
          {/* <Grid item xs={4} md={4}>
          
          </Grid> */}
          <Grid item xs={6} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={4} md={4}>
                <CustomTextField
                  select
                  className='w-full xs:w-auto'
                  id='select-status'
                  value={Pattient_type}
                  onChange={e => setPattient_type(e.target.value)}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value=''>เลือกประเภทคนไข้</MenuItem>
                  <MenuItem value='IPD'>IPD</MenuItem>
                  <MenuItem value='OPD'>OPD</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={4} md={4}>
                <CustomTextField
                  select
                  className='w-full xs:w-auto'
                  id='select-status'
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value=''>เลือกแผนก / หน่วยงาน</MenuItem>
                  <MenuItem value='0001 : แม่และเด็ก'>0001 : แม่และเด็ก</MenuItem>
                  <MenuItem value='0002 : หัวใจ'>0002 : หัวใจ</MenuItem>
                  <MenuItem value='0003 : อายุรกรรม'>0003 : อายุรกรรม</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={4} md={4}>
                {/* <AutoCompleteDoc/> */}
                <CustomAutocomplete
                  value={mapData.find(option => option.title == formValues.docName) || null}
                  name='docName'
                  //   defaultValue="นายแพทย์ถานไถ จิ้น"
                  // filterOptions={filterOptions}
                  // onChange={handleChange}
                  onChange={(event, newValue) => handleChangeSelect(null, newValue)}
                  // onChange={e => handleChange(e.target.value, "relation")}
                  options={mapData}
                  id='autocomplete-custom'
                  getOptionLabel={option => option.title || ''}
                  disabled={isViewOnly}
                  // isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderInput={params => (
                    <CustomTextField
                      placeholder='ค้นหาแพทย์ 3 ตัวอักษร'
                      {...params}
                      error={!formValues.docName && sendData}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers className='gap-6'>
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label='simple tabs example'>
            <Tab value='1' label='ปกติ' />
            <Tab value='2' label='ตรวจร่างกาย/ตา' />
            <Tab value='3' label='อัปโหลดไฟล์' />
          </TabList>
          <TabPanel value='1'>
            {/* <CreateProfile formValues={formValues} setFormValues={setFormValues} isViewOnly={isViewOnly} /> */}
          </TabPanel>
          <TabPanel value='2'>
            {/* <PhysicalExamination formValues={formValues} setFormValues={setFormValues} isViewOnly={isViewOnly} /> */}
          </TabPanel>
          <TabPanel value='3'>
            {/* <UploadFiles files={files} setFiles={setFiles} isViewOnly={isViewOnly} /> */}
          </TabPanel>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={submitForm} variant='outlined' color='primary' className='mt-3'>
          บันทึก
        </Button>
        <Button onClick={onCloseModal} variant='outlined' color='secondary' className='mt-3'>
          ยกเลิก
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OpdDetailComponent
