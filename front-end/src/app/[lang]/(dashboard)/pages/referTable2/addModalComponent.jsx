'use client'

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from '@mui/material';


import UploadFiles from './upload'
import CreateProfile from './createProfile'
import PhysicalExamination from './physicalExamination'
import relation from '@/data/relation.json'


// MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { toast } from 'react-toastify';
import CustomAutocomplete from '@/@core/components/mui/Autocomplete';
import CustomTextField from '@/@core/components/mui/TextField';

const initialFormValue = {
  // CreateProfile
  weight: "",
  height: "",
  BMI: "",
  temperature: "",
  pulse: "",
  breathing: "",
  pressure: "",
  systonic: "",
  diastolic: "",
  o2sat: "",
  bsa: "",
  vas: "",
  basicDrink: "ไม่ดื่ม",
  basicSmoke: "ไม่สูบ",
  // basicPlane: "สามารถขึ้นเครื่องบินได้",
  //แถบฝั่งซ้าย 
  diagnosisList: [],
  cc: "",
  hpi: "",
  pmh: "",
  dx: "",

  IOPatLE: "",
  IOPatRE: "",
  VAccLE: "",
  VAccRE: "",
  VAscLE: "",
  VAscRE: "",
  ga: "",
  pe: "",
  docNote: "",

  file: [],
  docName: "นายแพทย์ถานไถ จิ้น"
}

export const MockData = {
  weight: "60",
  height: "180",
  BMI: "18.52",
  temperature: "36.5",
  pulse: "",
  breathing: "",
  pressure: "",
  systonic: "",
  diastolic: "",
  o2sat: "",
  bsa: "",
  vas: "",
  basicDrink: "ดื่มบางครั้ง",
  basicSmoke: "สูบบางครั้ง",
  // basicPlane : "ไม่สามารถขึ้นเครื่องบินได้",
  cc: "{\"blocks\":[{\"key\":\"bimqe\",\"text\":\"หยุดตัวเองยังไงฉันไม่ควรปล่อยใจให้รัก\",\"type\":\"ordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":7,\"length\":5,\"style\":\"BOLD\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}}",
  hpi: "{\"blocks\":[{\"key\":\"bimqg\",\"text\":\"หักใจยังไงไม่ให้โบยและบินไปกับเธอ\",\"type\":\"ordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":7,\"length\":5,\"style\":\"BOLD\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}}",
  pmh: "{\"blocks\":[{\"key\":\"bimqfe\",\"text\":\"รู้ว่าไม่ควรรัก รักคนอย่างเธอ\",\"type\":\"ordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":7,\"length\":5,\"style\":\"BOLD\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}}",
  dx: "{\"blocks\":[{\"key\":\"bimqe\",\"text\":\"แต่ฉันไม่รู้จะยื้อจะทนและฝืนยังไง\",\"type\":\"ordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":7,\"length\":5,\"style\":\"BOLD\"}],\"entityRanges\":[],\"data\":{\"text-align\":\"center\"}}],\"entityMap\":{}}",
  IOPatLE: "",
  IOPatRE: "",
  VAccLE: "",
  VAccRE: "",
  VAscLE: "",
  VAscRE: "",

  ga: "{\"blocks\":[{\"key\":\"ep9fg\",\"text\":\"จิตใจมีเสียงเตือนเบาๆ ว่าเรื่องราวรักของเรา \",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":34,\"style\":\"color-rgb(32,33,36)\"},{\"offset\":0,\"length\":34,\"style\":\"bgcolor-rgb(255,255,255)\"},{\"offset\":0,\"length\":34,\"style\":\"fontsize-14\"},{\"offset\":0,\"length\":34,\"style\":\"fontfamily-Arial, sans-serif\"}],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
  pe: "{\"blocks\":[{\"key\":\"ep9fg\",\"text\":\"มันผิดแต่ฉันยอม ไม่เป็นไร \",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":34,\"style\":\"color-rgb(32,33,36)\"},{\"offset\":0,\"length\":34,\"style\":\"bgcolor-rgb(255,255,255)\"},{\"offset\":0,\"length\":34,\"style\":\"fontsize-14\"},{\"offset\":0,\"length\":34,\"style\":\"fontfamily-Arial, sans-serif\"}],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
  docNote: "{\"blocks\":[{\"key\":\"ep9fg\",\"text\":\"หากว่าฉันนั้นรู้ว่าสักวันจะได้พบเธอ \",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":34,\"style\":\"color-rgb(32,33,36)\"},{\"offset\":0,\"length\":34,\"style\":\"bgcolor-rgb(255,255,255)\"},{\"offset\":0,\"length\":34,\"style\":\"fontsize-14\"},{\"offset\":0,\"length\":34,\"style\":\"fontfamily-Arial, sans-serif\"}],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",

  file: [],
  // diagnosisList:
  diagnosisList:
    [
      {
        diagnosisList: {
          id: "IC001",
          title: "A00 : อหิวาตกโรค : Cholera"
        }
      },
      {
        diagnosisList: {
          id: "IC1761",
          title: "G940 : โพรงสมองคั่งน้ำในโรคติดเชื้อและปรสิตที่จำแนกไว้ที่อื่น (A00-B99+) : Hydrocephalus in infectious and parasitic diseases classified elsewhere (A00-B99)"
        }
      }
    ],
  docName: "แพทย์หญิงเยี่ย ซีอู้"
}


const AddUserComponenet = ({ title, open, onClose, isViewOnly }) => {
  // States
  const [value, setValue] = useState('1')

  const [formValues, setFormValues] = useState(initialFormValue);
  const [files, setFiles] = useState([])
  // const [sendData, setSendData] = useState(false)

  useEffect(() => {
    if (title === 'เพิ่มการซักประวัติ') {
      setFormValues(initialFormValue)
    } else {
      setFormValues(MockData);
    }
    setFiles([])
  }, [title, open, onClose]);

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  // console.log(formValues)

  // const isFormIncomplete = !formValues.docName||formValues.diagnosisList.length==0 || hasEmptyTextField(formValues.cc) || hasEmptyTextField(formValues.hpi)|| hasEmptyTextField(formValues.pmh)|| hasEmptyTextField(formValues.dx);

  const submitForm = () => {
    // console.log(formValues, 'submit')
    // if (formValues==initialFormValue) {
    //   toast.error('กรุณากรอกข้อมูลให้ครบ!')
    //   // setSendData(true)
    // } else {
    onClose();
    toast.success('บันทึกข้อมูลสำเร็จ!')
    // setSendData(false)
    setFormValues(initialFormValue)
    // }
    setValue('1')
  };

  const onCloseModal = () => {
    setFormValues(initialFormValue)
    setFiles([])
    // setSendData(false)
    onClose()
    setValue('1')
  }

  // function hasEmptyTextField(jsonData) {
  //   try {
  //     const parsedData = JSON.parse(jsonData);
  //     return parsedData.blocks.some(block => block.text === "");
  //   } catch (e) {
  //     // console.error("Invalid JSON", e);
  //     return e;
  //   }
  // }

  const mapData = relation.doctorName.map((item, index) => ({
    id: `${index + 1}`,
    title: item
  }));
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
    setFormValues((prevValues) => ({
      ...prevValues,
      docName: newValue ? newValue.title : '',
    }));

  }

  return (
    <Dialog open={open} onClose={(event, reason) => {
      if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
        // onClose();
        onCloseModal
      }
    }} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Grid container spacing={3}>
          <Grid item xs={4} md={4}>{title}</Grid>
          <Grid item xs={4} md={4}></Grid>
          <Grid item xs={4} md={4}>
            {/* <AutoCompleteDoc/> */}

            <CustomAutocomplete
              value={mapData.find(option => option.title == formValues.docName) || null}
              name="docName"
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
              renderInput={params => <CustomTextField placeholder='ค้นหาแพทย์ 3 ตัวอักษร' {...params} error={!formValues.docName && sendData} />}
            />
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
            <CreateProfile formValues={formValues} setFormValues={setFormValues} isViewOnly={isViewOnly} />
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
        <Button onClick={submitForm} variant="outlined" color="primary" className='mt-3' >
          บันทึก
        </Button>
        <Button onClick={onCloseModal} variant="outlined" color="secondary" className='mt-3'>
          ยกเลิก
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserComponenet;
