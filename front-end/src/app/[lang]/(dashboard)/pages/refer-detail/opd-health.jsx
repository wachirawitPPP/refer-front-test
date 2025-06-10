'use client'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import dynamic from 'next/dynamic'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// import { Editor } from 'react-draft-wysiwyg'
import axios from 'axios'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import Paper from '@mui/material/Paper'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { useTheme } from '@emotion/react'
import { useSession } from 'next-auth/react'

const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })
export default function OpdHealth({ formValues, setFormValues, isViewOnly }) {
  console.log(formValues)
  const initializeEditorState = formValues => {
    if (formValues?.cc && formValues?.hpi && formValues?.pmh && formValues?.dx) {
      try {
        const contentStateCC = convertFromRaw(JSON.parse(formValues.cc))
        const contentStateHPI = convertFromRaw(JSON.parse(formValues.hpi))
        const contentStatePMH = convertFromRaw(JSON.parse(formValues.pmh))
        const contentStateDX = convertFromRaw(JSON.parse(formValues.dx))
        return {
          editorStateCC: EditorState.createWithContent(contentStateCC),
          editorStateHPI: EditorState.createWithContent(contentStateHPI),
          editorStatePMH: EditorState.createWithContent(contentStatePMH),
          editorStateDX: EditorState.createWithContent(contentStateDX)
        }
      } catch (e) {
        console.error('Failed to parse editor content:', e)
        return {
          editorStateCC: EditorState.createEmpty(),
          editorStateHPI: EditorState.createEmpty(),
          editorStatePMH: EditorState.createEmpty(),
          editorStateDX: EditorState.createEmpty()
        }
      }
    }

    return {
      editorStateCC: EditorState.createEmpty(),
      editorStateHPI: EditorState.createEmpty(),
      editorStatePMH: EditorState.createEmpty(),
      editorStateDX: EditorState.createEmpty()
    }
  }

  const { editorStateCC, editorStateHPI, editorStatePMH, editorStateDX } = initializeEditorState(formValues)
  const [value1, setValue1] = useState(editorStateCC)
  const [value2, setValue2] = useState(editorStateHPI)
  const [value3, setValue3] = useState(editorStatePMH)
  const [value4, setValue4] = useState(editorStateDX)
  const [showRow, setShowRow] = useState(formValues.diagnosisList)
  const [currentValuesSelect, setCurrentValuesSelect] = useState({
    diagnosisList: null
  })
  const [mapDatat, setMapDatat] = useState([])
  const [formValuesSelect, setFormValuesSelect] = useState(formValues.diagnosisList)
  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.down('md'))
  const { data: session, status } = useSession()
  const [confirmDiagDelete, setConfirmDiagDelete] = useState(false)
  const [diagId, setDiagId] = useState('')

  const OpenConfirmDelete = () => setConfirmDiagDelete(true)
  const CloseConfirmDelete = () => setConfirmDiagDelete(false)
  const ConfirmDeleteDiag = item => {
    const newFormValues = [...formValuesSelect]
    const diag_id = diagId
    setFormValuesSelect(newFormValues)
    setFormValues(prevValues => ({
      ...prevValues,
      diagnosisList: newFormValues
    }))
    console.log('REMOVE_ID', diag_id)
    axios
      .delete(`${process.env.NEXT_PUBLIC_TEST_API_URL}/opds/deleteOpdDiag/${diag_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${session.user.token}`
        }
      })
      .then(res => {
        console.log(res.data)
        newFormValues.splice(item, 1)
        setConfirmDiagDelete(false)
      })
      .catch(error => {
        console.error('Error deleting OPD Diagnosis:', error)
      })
  }
  useEffect(() => {
    const content1 = JSON.stringify(convertToRaw(value1.getCurrentContent()))
    const content2 = JSON.stringify(convertToRaw(value2.getCurrentContent()))
    const content3 = JSON.stringify(convertToRaw(value3.getCurrentContent()))
    const content4 = JSON.stringify(convertToRaw(value4.getCurrentContent()))

    setFormValues(prevValues => ({
      ...prevValues,
      cc: content1,
      hpi: content2,
      pmh: content3,
      dx: content4
    }))
  }, [value1, value2, value3, value4, setFormValues])

  const handleInputChange = (event, value) => {
    if (value.length > 2) {
      fetchIcdData(value.toUpperCase())
    } else {
      setMapDatat([])
    }
  }

  const fetchIcdData = async value => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/apps/icd/`,
        { query: value },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      // Ensure response data is an array
      if (Array.isArray(response.data)) {
        setMapDatat(response.data)
        // console.log(response.data,"response.data")
      } else {
        setMapDatat([])
      }
    } catch (error) {
      setMapDatat([])
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error:', error.response.data.message)
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error: No response received from the server')
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message)
      }
    }
  }

  let handleChange = event => {
    const { name, value } = event.target
    setFormValues(prevValues => {
      const newValues = { ...prevValues, [name]: value }

      if (newValues.weight && newValues.height) {
        const weightInKg = parseFloat(newValues.weight)
        const heightInMeters = parseFloat(newValues.height) / 100
        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2)
        newValues.BMI = bmi
      } else {
        newValues.BMI = ''
      }

      return newValues
    })
  }

  const handleChangeSelect = (event, newValue) => {
    // if (event && event.target) {
    //     const { name, value } = event.target;
    //     setCurrentValuesSelect((prevValues) => ({
    //         ...prevValues,
    //         [name]: value,
    //     }));
    // } else {
    //     setCurrentValuesSelect((prevValues) => ({
    //         ...prevValues,
    //         diagnosisList: newValue,
    //     }));
    // }

    setCurrentValuesSelect(prevValues => ({
      ...prevValues,
      diagnosisList: newValue
    }))
  }

  const addFormFields = () => {
    setFormValuesSelect([...formValuesSelect, currentValuesSelect])
    setCurrentValuesSelect({ diagnosisList: null })
    setMapDatat([])
    setShowRow(true)
    setFormValues(prevValues => ({
      ...prevValues,
      diagnosisList: [...formValuesSelect, currentValuesSelect]
    }))
  }
  // console.log(formValues,"formValues---------")
  const removeFormFields = item => {
    const newFormValues = [...formValuesSelect]
    const diag_id = item.currentTarget.dataset.index
    setDiagId(diag_id)
    //newFormValues.splice(item, 1)
    setFormValuesSelect(newFormValues)
    setFormValues(prevValues => ({
      ...prevValues,
      diagnosisList: newFormValues
    }))
    console.log('REMOVE', newFormValues)
    //console.log("REMOVE_ID", newFormValues.slice(i,1)[0].id)
    console.log('REMOVE_ID', diag_id)

    setConfirmDiagDelete(true)
  }

  const handleEditChange = (editorState, name) => {
    // const contentState = editorState.getCurrentContent();

    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    setFormValues(prevValues => {
      const newValues = {
        ...prevValues,
        [name]: content
      }
      // console.log(newValues, 'formValues');
      return newValues
    })
  }

  const toolbarOptions = {
    options: ['inline', 'list', 'textAlign'],
    inline: {
      options: ['bold']
    },
    list: {
      options: ['unordered', 'ordered']
    },
    textAlign: {
      options: ['left', 'center', 'right', 'justify']
    }
  }

  return (
    <>
      <Dialog
        open={confirmDiagDelete}
        keepMounted
        onClose={CloseConfirmDelete}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle id='alert-dialog-slide-title'>ยืนยันการลบ</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>ต้องการยืนยันการบันทึกใช่หรือไม่?</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button color='secondary' onClick={CloseConfirmDelete}>
            ยกเลิก
          </Button>
          <Button color='error' onClick={ConfirmDeleteDiag}>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Grid container spacing={1} xs={12} sm={6} className='space-x-2'> */}
      <Grid container spacing={2} className='p-3'>
        <Grid item xs={12} md={6} style={{ paddingRight: '1em' }} className='space-y-3'>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} className='space-y-3'>
              <CustomTextField
                name='weight'
                type='number'
                value={formValues.weight}
                fullWidth
                label='น้ำหนัก'
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <CustomTextField
                name='height'
                type='number'
                value={formValues.height}
                fullWidth
                label='ส่วนสูง'
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <CustomTextField name='BMI' type='number' value={formValues.BMI} fullWidth label='BMI' disabled />
              <CustomTextField
                name='temperature'
                value={formValues.temperature}
                onChange={handleChange}
                fullWidth
                label='อุณหภูมิ'
                disabled={isViewOnly}
              />
              <CustomTextField
                name='bsa'
                value={formValues.bsa}
                onChange={handleChange}
                fullWidth
                label='BSA'
                disabled={isViewOnly}
              />
              <CustomTextField
                name='vas'
                value={formValues.vas}
                onChange={handleChange}
                fullWidth
                label='VAS'
                disabled={isViewOnly}
              />
            </Grid>
            <Grid item xs={12} md={6} className='space-y-3'>
              <CustomTextField
                name='pulse'
                value={formValues.pulse}
                onChange={handleChange}
                fullWidth
                label='ชีพจร'
                disabled={isViewOnly}
              />
              <CustomTextField
                name='breathing'
                value={formValues.breathing}
                onChange={handleChange}
                fullWidth
                label='การหายใจ'
                disabled={isViewOnly}
              />
              <CustomTextField
                name='pressure'
                value={formValues.pressure}
                onChange={handleChange}
                fullWidth
                label='ความดัน'
                disabled={isViewOnly}
              />
              <CustomTextField
                name='systonic'
                value={formValues.systonic}
                onChange={handleChange}
                fullWidth
                label='Systonic'
                disabled={isViewOnly}
              />
              <CustomTextField
                name='diastolic'
                value={formValues.diastolic}
                onChange={handleChange}
                fullWidth
                label='Diastolic'
                disabled={isViewOnly}
              />
              <CustomTextField
                name='o2sat'
                value={formValues.o2sat}
                onChange={handleChange}
                fullWidth
                label='O2Sat'
                disabled={isViewOnly}
              />
            </Grid>
          </Grid>
          <Typography color='text.primary'>ดื่มสุรา</Typography>
          <FormControl className='flex-wrap flex-row' disabled={isViewOnly}>
            <RadioGroup
              row
              value={formValues.basicDrink || 'ไม่ดื่ม'}
              name='basicDrink'
              onChange={handleChange}
              aria-label='basic-radio'
            >
              {/* <RadioGroup row defaultValue={formValues.basicDrink||'ไม่ดื่ม'} name='basicDrink' onChange={handleChange} aria-label='basic-radio'> */}
              <FormControlLabel value='1' control={<Radio />} label='ไม่ดื่ม' />
              <FormControlLabel value='2' control={<Radio />} label='ดื่มบางครั้ง' />
              <FormControlLabel value='3' control={<Radio />} label='ดื่ม' />
            </RadioGroup>
          </FormControl>

          <Typography color='text.primary'>สูบบุหรี่</Typography>
          <FormControl className='flex-wrap flex-row' disabled={isViewOnly}>
            {/* <RadioGroup row defaultValue={formValues.basicSmoke||'ไม่สูบ'} name='basicSmoke' onChange={handleChange} aria-label='basic-radio'> */}
            <RadioGroup
              row
              value={formValues.basicSmoke || 'ไม่สูบ'}
              name='basicSmoke'
              onChange={handleChange}
              aria-label='basic-radio'
            >
              <FormControlLabel value='ไม่สูบ' control={<Radio />} label='ไม่สูบ' />
              <FormControlLabel value='สูบบางครั้ง' control={<Radio />} label='สูบบางครั้ง' />
              <FormControlLabel value='สูบ' control={<Radio />} label='สูบ' />
            </RadioGroup>
          </FormControl>

          {/* <FormControl className='flex-wrap flex-row'>
                        <RadioGroup row value={formValues.basicPlane || 'สามารถขึ้นเครื่องบินได้'} name='basicPlane' onChange={handleChange} aria-label='basic-radio'>
                            <FormControlLabel value='สามารถขึ้นเครื่องบินได้' control={<Radio />} label='สามารถขึ้นเครื่องบินได้' />
                            <FormControlLabel value='ไม่สามารถขึ้นเครื่องบินได้' control={<Radio />} label='ไม่สามารถขึ้นเครื่องบินได้' />

                        </RadioGroup>
                    </FormControl> */}
        </Grid>
        
        <Grid item xs={12} md={6} className='space-y-3'>
          <Typography variant='h5' className='ml-1'>CC</Typography>
          <Editor
            placeholder='CC:'
            name='cc'
            editorState={value1}
            // value={formValues.temperature}
            toolbar={toolbarOptions}
            onEditorStateChange={data => {
              setValue1(data)
              handleEditChange(data, 'cc')
            }}
            wrapperClassName='demo-wrapper'
            // wrapperClassName= {hasEmptyTextField(formValues.cc) && sendData ? "demo-wrapper errorEditor" : "demo-wrapper" }
            editorClassName='demo-editor'
            readOnly={isViewOnly}
          />
          <Divider className='py-4'/>
          <Typography variant='h5' className='ml-1'>HPI</Typography>
          <Editor
            placeholder='HPI:'
            editorState={value2}
            toolbar={toolbarOptions}
            onEditorStateChange={data => {
              setValue2(data)
              handleEditChange(data, 'hpi')
            }}
            wrapperClassName='demo-wrapper'
            // wrapperClassName= {hasEmptyTextField(formValues.hpi) && sendData ? "demo-wrapper errorEditor" : "demo-wrapper" }
            editorClassName='demo-editor'
            readOnly={isViewOnly}
          />
          <Divider className='py-4'/>
          <Typography variant='h5' className='ml-1' >PMH</Typography>
          <Editor
            placeholder='PMH:'
            editorState={value3}
            toolbar={toolbarOptions}
            onEditorStateChange={data => {
              setValue3(data)
              handleEditChange(data, 'pmh')
            }}
            wrapperClassName='demo-wrapper'
            // wrapperClassName= {hasEmptyTextField(formValues.pmh) && sendData ? "demo-wrapper errorEditor" : "demo-wrapper" }
            editorClassName='demo-editor'
            readOnly={isViewOnly}
          />

          {/* <Editor
                        placeholder="DX:"
                        editorState={value4}
                        toolbar={toolbarOptions}
                        onEditorStateChange={(data) => {
                            setValue4(data);
                            handleEditChange(data, 'dx');
                        }}
                        wrapperClassName="demo-wrapper"
                        // wrapperClassName= {hasEmptyTextField(formValues.dx) && sendData ? "demo-wrapper errorEditor" : "demo-wrapper" }
                        editorClassName="demo-editor"
                        readOnly={isViewOnly}
                    /> */}
        </Grid>
      </Grid>

      {/* </Grid> */}
    </>
  )
}
