'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, MenuItem } from '@mui/material'

import UploadFiles from './upload'
import CreateProfile from './createProfile'
import PhysicalExamination from './physicalExamination'
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
import { useParams } from 'next/navigation'
const currentDate = new Date().toISOString()
const initialFormValue = {
  //CreateProfile
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
  docName: '',
  hn: '',
  customer_id: '',
  department_id: '',
  opd_code: '',
  opd_date: currentDate,
  pattient_type: '',
  customer_id: '', 

  // opd_weight:'',
  // opd_height:'',
  // opd_bmi:'',
  // opd_temperature:'',
  // opd_pulse:'',
  // opd_breathing:'',
  // opd_pressure:'',
  // opd_systonic:'',
  // opd_diastolic:'',
  // opd_o2sat:'',
  // opd_bsa:'',
  // opd_vas,
  // opd_opd_alcohol: '1',
  // opd_opd_fag: '',
  // opd_diagnosisList: '',
  // opd_cc: '',
  // opd_hpi: '',
  // opd_pmh: '',
  // opd_dx: '',
  // opd_IOPatLE: '',
  // opd_IOPatRE: '',
  // opd_VAccLE: '',
  // opd_VAccRE: '',
  // opd_VAscLE: '',
  // opd_VAscRE: '',
  // opd_ga: '',
  // opd_pe: '',
  // opd_docNote: '',
  // opd_file: [],
  // opd_docName: '',
  // hn: '001',
  // customer_id: '1',
  // department_id: '1',
  // opd_code: 'test1234',
  // opd_date: currentDate,
  // pattient_type: ''
}

const initialFormDiagnotis = {
  diagnostic_id: '',
  opd_id: '',
  diagnostic_code: '',
  diagnostic_th: '',
  diagnostic_en: '',
  diagnostic_detail: ''
}

export const MockData = {
  weight: '60',
  height: '180',
  BMI: '18.52',
  temperature: '36.5',
  pulse: '',
  breathing: '',
  pressure: '',
  systonic: '',
  diastolic: '',
  o2sat: '',
  bsa: '',
  vas: '',
  basicDrink: 'ดื่มบางครั้ง',
  basicSmoke: 'สูบบางครั้ง',
  // basicPlane : "ไม่สามารถขึ้นเครื่องบินได้",
  cc: '{"blocks":[{"key":"bimqe","text":"หยุดตัวเองยังไงฉันไม่ควรปล่อยใจให้รัก","type":"ordered-list-item","depth":0,"inlineStyleRanges":[{"offset":7,"length":5,"style":"BOLD"}],"entityRanges":[],"data":{"text-align":"center"}}],"entityMap":{}}',
  hpi: '{"blocks":[{"key":"bimqg","text":"หักใจยังไงไม่ให้โบยและบินไปกับเธอ","type":"ordered-list-item","depth":0,"inlineStyleRanges":[{"offset":7,"length":5,"style":"BOLD"}],"entityRanges":[],"data":{"text-align":"center"}}],"entityMap":{}}',
  pmh: '{"blocks":[{"key":"bimqfe","text":"รู้ว่าไม่ควรรัก รักคนอย่างเธอ","type":"ordered-list-item","depth":0,"inlineStyleRanges":[{"offset":7,"length":5,"style":"BOLD"}],"entityRanges":[],"data":{"text-align":"center"}}],"entityMap":{}}',
  dx: '{"blocks":[{"key":"bimqe","text":"แต่ฉันไม่รู้จะยื้อจะทนและฝืนยังไง","type":"ordered-list-item","depth":0,"inlineStyleRanges":[{"offset":7,"length":5,"style":"BOLD"}],"entityRanges":[],"data":{"text-align":"center"}}],"entityMap":{}}',
  IOPatLE: '',
  IOPatRE: '',
  VAccLE: '',
  VAccRE: '',
  VAscLE: '',
  VAscRE: '',

  ga: '{"blocks":[{"key":"ep9fg","text":"จิตใจมีเสียงเตือนเบาๆ ว่าเรื่องราวรักของเรา ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":34,"style":"color-rgb(32,33,36)"},{"offset":0,"length":34,"style":"bgcolor-rgb(255,255,255)"},{"offset":0,"length":34,"style":"fontsize-14"},{"offset":0,"length":34,"style":"fontfamily-Arial, sans-serif"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
  pe: '{"blocks":[{"key":"ep9fg","text":"มันผิดแต่ฉันยอม ไม่เป็นไร ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":34,"style":"color-rgb(32,33,36)"},{"offset":0,"length":34,"style":"bgcolor-rgb(255,255,255)"},{"offset":0,"length":34,"style":"fontsize-14"},{"offset":0,"length":34,"style":"fontfamily-Arial, sans-serif"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
  docNote:
    '{"blocks":[{"key":"ep9fg","text":"หากว่าฉันนั้นรู้ว่าสักวันจะได้พบเธอ ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":34,"style":"color-rgb(32,33,36)"},{"offset":0,"length":34,"style":"bgcolor-rgb(255,255,255)"},{"offset":0,"length":34,"style":"fontsize-14"},{"offset":0,"length":34,"style":"fontfamily-Arial, sans-serif"}],"entityRanges":[],"data":{}}],"entityMap":{}}',

  file: [],
  // diagnosisList:
  diagnosisList: [
    {
      diagnosisList: {
        id: 'IC001',
        title: 'A00 : อหิวาตกโรค : Cholera'
      }
    },
    {
      diagnosisList: {
        id: 'IC1761',
        title:
          'G940 : โพรงสมองคั่งน้ำในโรคติดเชื้อและปรสิตที่จำแนกไว้ที่อื่น (A00-B99+) : Hydrocephalus in infectious and parasitic diseases classified elsewhere (A00-B99)'
      }
    }
  ],
  docName: 'แพทย์หญิงเยี่ย ซีอู้'
}

const AddUserComponenet = ({ title, open, onClose, isViewOnly, tableData, dataEditOpds, isCreate }) => {
  // States
  const [value, setValue] = useState('1')
  const [formValues, setFormValues] = useState(initialFormValue)
  const [DiagnoticForm, setDiagnoticForm] = useState(initialFormDiagnotis)
  const [files, setFiles] = useState([])
  const [sendData, setSendData] = useState(false)
  const { data: session, status } = useSession()
  const [departments, setDepartment] = useState([])
  const [Pattient_type, setPattient_type] = useState('OPD')
  const [data, setData] = useState(tableData)
  //const [dataEditOpds, setDataEditOpds] = useState(dataEditOpd)
  const [dataOpd, setDataOpd] = useState('')
  const [dataEditOpdForm, setDataEditOpdForm] = useState(dataEditOpds)
  const { id } = useParams(); 

  useEffect(() => {
    let dataEditOpdForm = {}
    if (dataEditOpds) {
      if (dataEditOpds.pattient_type) {
        setPattient_type(dataEditOpds.pattient_type)
        dataEditOpdForm = {
          id: dataEditOpds.id,
          weight: dataEditOpds.opd_weight || '',
          height: dataEditOpds.opd_height || '',
          BMI: dataEditOpds.opd_bmi || '',
          temperature: dataEditOpds.opd_temperature || '',
          pulse: dataEditOpds.opd_pulse || '',
          breathing: dataEditOpds.opd_breathing || '',
          pressure: dataEditOpds.opd_pressure || '',
          systonic: dataEditOpds.opd_systonic || '',
          diastolic: dataEditOpds.opd_diastolic || '',
          o2sat: dataEditOpds.opd_o2sat || '',
          bsa: dataEditOpds.opd_bsa || '',
          vas: dataEditOpds.opd_vas || '',
          basicDrink: dataEditOpds.opd_alcohol || '',
          basicSmoke: dataEditOpds.opd_fag || '',
          // basicPlane : "ไม่สามารถขึ้นเครื่องบินได้",
          cc: dataEditOpds.opd_cc || '',
          hpi: dataEditOpds.opd_hpi || '',
          pmh: dataEditOpds.opd_pmh || '',
          dx: dataEditOpds.opd_dx || '',
          IOPatLE: dataEditOpds.opd_IOPatLE || '',
          IOPatRE: dataEditOpds.opd_IOPatRE || '',
          VAccLE: dataEditOpds.opd_VAccLE || '',
          VAccRE: dataEditOpds.opd_VAccRE || '',
          VAscLE: dataEditOpds.opd_VAscLE || '',
          VAscRE: dataEditOpds.opd_VAscRE || '',

          ga: dataEditOpds.opd_ga || '',
          pe: dataEditOpds.opd_pe || '',
          docNote: dataEditOpds.opd_docNote || '',

          //file: [],
          // diagnosisList:
          diagnosisList: dataEditOpds.opd_diagnostics || '',
          docName: dataEditOpds.opd_docName || '',
          customer_id: dataEditOpds.customer_id || '',
          department_id: dataEditOpds.department_id || '',
          opd_code: dataEditOpds.opd_code || '',
          opd_date: dataEditOpds.opd_date || '',
          hn: dataEditOpds.hn || '',
          pattient_type: dataEditOpds.pattient_type
        }
      }
      console.log('dataEditOpds', dataEditOpdForm)
      setDataEditOpdForm(dataEditOpds)
    } else {
      //setDataEditOpdForm('')
    }
    if (title === 'เพิ่มการซักประวัติ') {
      setFormValues(initialFormValue)
    } else {
      setFormValues({ ...initialFormValue, ...dataEditOpdForm })
    }
    //console.log('DataEditOpd', dataEditOpd)
    //console.log('MockData', MockData)
    // const filteredData = tableData?.filter(user => {
    //   if (department && user.department !== department) return false

    //   return true
    // })

    const GetDepartment = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/department`, {
          headers: {
            Authorization: `${session.user?.token}`
          }
        })
  
        const data = response.data.departments
        setDepartment(data)
        console.log('responseDepart', response.data)
        return data
      } catch (error) {
        console.log('something went wrong !')
        return null
      }
    }
    GetDepartment()
    // if(dataEditOpd !==null ){

    //   if(dataEditOpds.pattient_type){
    //     setPattient_type(dataEditOpds.pattient_type)
    //   }

    //setData(filteredData)

    setFiles([])
  }, [title, open, onClose, tableData, dataEditOpds])
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  // console.log(formValues)

  // const isFormIncomplete = !formValues.docName||formValues.diagnosisList.length==0 || hasEmptyTextField(formValues.cc) || hasEmptyTextField(formValues.hpi)|| hasEmptyTextField(formValues.pmh)|| hasEmptyTextField(formValues.dx);

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
    axios
      .get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/diagnostics/${formValues.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${session.user.token}`
        }
      })
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.error('Axios error:', error)
      })
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
      opd_pulse: formValues.pulse,
      opd_breathing: formValues.breathing,
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
      customer_id: parseInt(formValues.customer_id) || parseInt(id),
      department_id: parseInt(formValues.department_id),
      opd_code: formValues.opd_code,
      opd_date: formValues.opd_date
    }
    console.log(formValues, 'submit')
    console.log(formData, 'formData')
    console.log(Pattient_type, 'Pattient_type')
    console.log(formValues.diagnosisList, 'diagnosisList')

    // if (!formValues.weight && !formValues.BMI && !formValues.height) {
    //   toast.error('กรุณากรอกข้อมูลให้ครบ!')
    //   setSendData(true)
    // } else {
    //   await axios
    //     .post(
    //       `${process.env.NEXT_PUBLIC_TEST_API_URL}/createopd`,
    //       {
    //         ...formData
    //       },
    //       {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           Authorization: `${session.user.token}`
    //         }
    //       }
    //     )
    //     .then(response => {
    //       if (response.data.status == 201) {
    //         //******Form Diagnostics*******
    //         const DiagnosticsForm = []
    //         const opdId = response.data.lastId
    //         formValues.diagnosisList.forEach(item => {
    //           console.log('item', item)
    //           const data = {
    //             diagnostic_id: item.diagnosisList.id,
    //             diagnostic_code: item.diagnosisList.diagnostics_code,
    //             diagnostic_th: item.diagnosisList.diagnostics_th,
    //             diagnostic_en: item.diagnosisList.diagnostics_en,
    //             opd_id: opdId
    //           }
    //           DiagnosticsForm.push(data)
    //         })
    //         console.log('data', DiagnosticsForm)
    //         let response = axios.post(`${process.env.NEXT_PUBLIC_TEST_API_URL}/createopddiag`, DiagnosticsForm, {
    //           headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `${session.user.token}`
    //           }
    //         })
    //         console.log(response)
    //         onClose()
    //         toast.success('บันทึกข้อมูลสำเร็จ!')
    //         setSendData(false)
    //         setValue('1')
    //       }
    //       console.log('response', response)
    //     })

    // }

    if (!formValues.weight && !formValues.BMI && !formValues.height && !formValues.department_id && !formValues.docName) {
      toast.error('กรุณากรอกข้อมูลให้ครบ!')
      setSendData(true)
    } else {
      try {
        if (isCreate) {
          console.log('Create')

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
          )
          console.log('response1', response1)
          if (response1.status === 201) {
            //******Form Diagnostics*******
            const DiagnosticsForm = []
            const opdId = response1.data.lastId
            formValues.diagnosisList.forEach(item => {
              console.log('item', item)
              const data = {
                diagnostic_id: item.diagnosisList.id,
                diagnostic_code: item.diagnosisList.diagnostics_code,
                diagnostic_th: item.diagnosisList.diagnostics_th,
                diagnostic_en: item.diagnosisList.diagnostics_en,
                opd_id: opdId
              }
              DiagnosticsForm.push(data)
            })
            console.log('data', DiagnosticsForm)

            const response2 = await axios.post(
              `${process.env.NEXT_PUBLIC_TEST_API_URL}/createopddiag`,
              DiagnosticsForm,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `${session.user.token}`
                }
              }
            )

            console.log(response2)
            onClose()
            toast.success('บันทึกข้อมูลสำเร็จ!')
            setSendData(false)
            setValue('1')
          } else {
            console.log('response1', response1)
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล OPD!')
          }
        } else {
          const response1 = await axios.put(
            `${process.env.NEXT_PUBLIC_TEST_API_URL}/opds/update/${formValues.id}`,
            {
              ...formData
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `${session.user.token}`
              }
            }
          )

          onClose()
          toast.success('อัพเดตข้อมูลสำเร็จ!')
          setSendData(true)
          setValue('1')
          console.log('Updating', response1)
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล!')
        setSendData(false)
      }
    }
  }

  const onCloseModal = () => {
    setFormValues(initialFormValue)
    setFiles([])
    // setSendData(false)
    onClose()
    setValue('1')
  }

  const defprops = {
    options: departments.map(option => ({ id: option.id, name: option.name })),
    getOptionLabel: options => options.name
  }

  const mapData = relation.doctorName.map((item, index) => ({
    id: `${index + 1}`,
    title: item
  }))
  const handleChangeSelect = (event, newValue) => {
    // console.log(newValue, "newValue")
    // console.log({ ...currentValuesSelect, docName: newValue }, "currentValues");
    // if (event && event.target) {
    //   const { name, value } = event.target;
    //   setCurrentValuesSelect((prevValues) => ({
    //     ...prevValues,
    //     [name]: value,
    //   }));
    //   console.log({ ...currentValuesSelect, [name]: value }, "currentValues");
    // } else {
    //   setCurrentValuesSelect((prevValues) => ({
    //     ...prevValues,
    //     docName: newValue,
    //   }));
    // }
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
          // onClose();
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
                <CustomAutocomplete
                  
                  className='w-full xs:w-auto'
                  //id='select-status'
                  {...defprops}
                  //value={department}
                  onChange={(event, newValue) => setFormValues({...formValues,department_id: newValue.id })} 
                  isOptionEqualToValue={(option, value) => option === value}
                  renderInput={params => (
                    <CustomTextField
                      placeholder='แผนก/หน่วยงาน'
                      {...params} 
                      error={!formValues.department_id && sendData}
                    />
                  )}
                />  
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
            <CreateProfile formValues={formValues} dataEditOpds={dataEditOpdForm} setFormValues={setFormValues} isViewOnly={isViewOnly} />
          </TabPanel>
          <TabPanel value='2'>
            <PhysicalExamination formValues={formValues} setFormValues={setFormValues} isViewOnly={isViewOnly} />
          </TabPanel>
          <TabPanel value='3'>
            <UploadFiles files={files} setFiles={setFiles} isViewOnly={isViewOnly} />
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

export default AddUserComponenet
