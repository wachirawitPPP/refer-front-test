'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Collapse,
  Card,
  Box,
  TablePagination,
  TableSortLabel,
  InputAdornment,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Input,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Divider,
  useMediaQuery,
  InputLabel
} from '@mui/material'
import DataNotFound from '@/views/DataNotFound'
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import Procedure from './opd-component/procedure'
import MedicationStatement from './opd-component/medication-statement'
import Observation from './opd-component/observation'
import DiagnosticList from './opd-component/diagnostic-list'
import VitalSigns from './vital-signs'
import EOpdCard from './opd-component/e-opd-card'
import FileScan from './opd-component/file-scan'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useParams,useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify' 
function Row(props) {
  const { dataOpds, setSidePanelComponent, isExpanded, onToggle } = props
  const [open, setOpen] = React.useState(false)
  const [diagDialog, setDiagdialog] = React.useState(false)
  const [labDialog, setLabDialog] = React.useState(false)
  const [medDialog, setMedDialog] = React.useState(false)
  const [vaccineDialog, setVaccinDialog] = React.useState(false)
  const [fileScanDialog, setFileScanDialog] = React.useState(false)
  const [procedureDialog, setProcedureDialog] = React.useState(false)
  const isMobile = useMediaQuery('(max-width:600px)')
  const params = useSearchParams()
  const checkNullData = data => {
    if (data.length === 0) return true
    else return false
  }

  const handleDialogClose = () => {
    setVaccinDialog(false)
    setMedDialog(false)
    setLabDialog(false)
    setDiagdialog(false)
    setProcedureDialog(false)
    setFileScanDialog(false)
  }
  const formatDateTime = datetime => {
    if (!datetime) return ''

    const year = datetime.slice(0, 4)
    const month = datetime.slice(4, 6)
    const day = datetime.slice(6, 8)
    const hour = datetime.slice(8, 10)
    const minute = datetime.slice(10, 12)
    const second = datetime.slice(12, 14)

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`
  }

  return (
    <React.Fragment>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          backgroundColor: isExpanded ? '#AAD7D9' : 'inherit', // Highlight the expanded row
          transition: 'background-color 0.3s ease' // Smooth transition
        }}
      >
        <TableCell onClick={onToggle}>
          <IconButton aria-label='expand row' size='small'>
            <i
              className={`tabler-triangle-inverted -rotate-90
                 mbe-2 text-[16px] items-center ${
                   isExpanded ? 'rotate-0 text-success' : ''
                 } transition-transform duration-300`}
            />
          </IconButton>
        </TableCell>

        <TableCell onClick={onToggle} className='whitespace-nowrap'>
          {formatDateTime(dataOpds?.PV1_ADMIT_DATE_TIME) || ''}
        </TableCell>
        <TableCell onClick={onToggle} className='whitespace-nowrap'>
          {dataOpds?.PV1_CLINIC_NAME || ''}
        </TableCell>
        <TableCell onClick={onToggle} className='whitespace-nowrap'>
          {dataOpds?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || '-'}
        </TableCell>
        <TableCell className='w-60 space-x-1  whitespace-nowrap'>
          <Tooltip
            title='Diagnostic'
            arrow // Optional: adds an arrow to the tooltip
            disableHoverListener={checkNullData(dataOpds?.Diag)} // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  if (isMobile) {
                    setDiagdialog(true)
                  } else {
                    setSidePanelComponent(
                      <div>
                        <Typography variant='h5' className=''>
                          {dataOpds?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || ''}-{dataOpds?.PV1_CLINIC_NAME}-
                          {formatDateTime(dataOpds?.PV1_ADMIT_DATE_TIME)}
                        </Typography>
                        <DiagnosticList data={dataOpds?.Diag} />
                      </div>
                    )
                  }
                }}
                disabled={checkNullData(dataOpds?.Diag)}
                style={{
                  backgroundColor: checkNullData(dataOpds?.Diag) ? '#e3e5e0' : '#009B77' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-file-search w-5 h-5 ${checkNullData(dataOpds?.Diag) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
          <Tooltip
            title='Procedure'
            arrow // Optional: adds an arrow to the tooltip
            disableHoverListener={checkNullData(dataOpds?.Procedure)} // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  if (isMobile) {
                    setProcedureDialog(true)
                  } else {
                    setSidePanelComponent(
                      <div>
                        <Typography variant='h5' className=''>
                          {dataOpds?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || ''}-{dataOpds?.PV1_CLINIC_NAME}-
                          {formatDateTime(dataOpds?.PV1_ADMIT_DATE_TIME)}
                        </Typography>
                        <Procedure data={dataOpds?.Procedure} />
                      </div>
                    )
                  }
                }}
                disabled={checkNullData(dataOpds?.Procedure)}
                style={{
                  backgroundColor: checkNullData(dataOpds?.Procedure) ? '#e3e5e0' : '#36C2CE' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-stethoscope w-5 h-5 ${checkNullData(dataOpds?.Procedure) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
          <Tooltip
            title='Medication'
            arrow // Optional: adds an arrow to the tooltip
            disableHoverListener={checkNullData(dataOpds?.Medicine)} // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  if (isMobile) {
                    setMedDialog(true)
                  } else {
                    setSidePanelComponent(
                      <div>
                        <Typography variant='h5' className=''>
                          {dataOpds?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || ''}-{dataOpds?.PV1_CLINIC_NAME}-
                          {formatDateTime(dataOpds?.PV1_ADMIT_DATE_TIME)}
                        </Typography>
                        <MedicationStatement data={dataOpds?.Medicine} />
                      </div>
                    )
                  }
                }}
                disabled={checkNullData(dataOpds?.Medicine)}
                style={{
                  backgroundColor: checkNullData(dataOpds?.Medicine) ? '#e3e5e0' : '#B565A7' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-pill w-5 h-5 ${checkNullData(dataOpds?.Medicine) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
          <Tooltip
            title='Lab'
            arrow // Optional: adds an arrow to the tooltip
            disableHoverListener={checkNullData(dataOpds?.Lab)} // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  setLabDialog(true)
                }}
                disabled={checkNullData(dataOpds?.Lab)}
                style={{
                  backgroundColor: checkNullData(dataOpds?.Lab) ? '#e3e5e0' : '#88B04B' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-microscope w-5 h-5 ${checkNullData(dataOpds?.Lab) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
          <Tooltip
            title='EMR'
            arrow // Optional: adds an arrow to the tooltip
            disableHoverListener={checkNullData(dataOpds?.Lab)} // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  if (isMobile) {
                    setFileScanDialog(true)
                  } else {
                    setSidePanelComponent(
                      <div>
                        <Typography variant='h5' className=''>
                          {dataOpds?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || ''}-{dataOpds?.PV1_CLINIC_NAME}-
                          {formatDateTime(dataOpds?.PV1_ADMIT_DATE_TIME)}
                        </Typography>
                        {/* <FileScan data={dataOpds?.Lab} /> */}
                        <EOpdCard
                        data={dataOpds?.file_scan}
                        date={dataOpds?.PV1_ADMIT_DATE_TIME}
                        SETID_PV1={dataOpds?.SETID_PV1}
                        hn={params.get('id_card')}
                      />
                      </div>
                    )
                  }
                }}
                disabled={checkNullData(dataOpds?.Lab)}
                style={{
                  backgroundColor: checkNullData(dataOpds?.Lab) ? '#e3e5e0' : '#FF0000' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-letter-e w-5 h-5 ${checkNullData(dataOpds?.Lab) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
          <Tooltip
            title='File-Scan'
            arrow // Optional: adds an arrow to the tooltip
            disableHoverListener={checkNullData(dataOpds?.Lab)} // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  setSidePanelComponent(
                    <div>
                      <Typography variant='h5' className=''>
                        {dataOpds?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || ''}-{dataOpds?.PV1_CLINIC_NAME}-
                        {formatDateTime(dataOpds?.PV1_ADMIT_DATE_TIME)}
                      </Typography>
                      <EOpdCard data={dataOpds?.Lab} />
                    </div>
                  )
                }}
                disabled={checkNullData(dataOpds?.Lab)}
                style={{
                  backgroundColor: checkNullData(dataOpds?.Lab) ? '#e3e5e0' : '#FFA24C' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-letter-s w-5 h-5 ${checkNullData(dataOpds?.Lab) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded} timeout='auto' unmountOnExit>
            <VitalSigns data={dataOpds} />
          </Collapse>
        </TableCell>
      </TableRow>
      <Dialog maxWidth='lg' fullWidth open={diagDialog} onClose={handleDialogClose}>
        <DialogTitle>
          <div>
            <Typography variant='h3'>Diagnostics</Typography>
          </div>
          <div className='flex flex-col sm:flex-row '>
            <Typography variant='h5'>
              {' '}
              Visit Number: <span className='text-primary w-full'> {dataOpds?.PV1_VISIT_NUMBER}</span>
            </Typography>
            <Typography variant='h5'>
              {' '}
              Department: <span className='text-primary'>{dataOpds?.PV1_CLINIC_NAME} </span>
            </Typography>
            <Typography variant='h5'>
              {' '}
              Doctor: <span className='text-primary'>{dataOpds?.PV1_ATTENDING_DOCTOR_NAME} </span>{' '}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <DiagnosticList data={dataOpds?.Diag} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant='outlined' color='secondary'>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog maxWidth='lg' fullWidth open={procedureDialog} onClose={handleDialogClose}>
        <DialogTitle>
          <div>
            <Typography variant='h3'>Lab</Typography>
          </div>
          <div className='flex flex-col sm:flex-row '>
            <Typography variant='h5'>
              {' '}
              Visit Number: <span className='text-primary w-full'> {dataOpds?.PV1_VISIT_NUMBER}</span>
            </Typography>
            <Typography variant='h5'>
              {' '}
              Department: <span className='text-primary'>{dataOpds?.PV1_CLINIC_NAME} </span>
            </Typography>
            <Typography variant='h5'>
              {' '}
              Doctor: <span className='text-primary'>{dataOpds?.PV1_ATTENDING_DOCTOR_NAME} </span>{' '}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <Procedure data={dataOpds?.Procedure} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant='outlined' color='secondary'>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog maxWidth='lg' fullWidth open={medDialog} onClose={handleDialogClose}>
        <DialogTitle>
          <div>
            <Typography variant='h3'>Medicine</Typography>
          </div>
          <div className='flex flex-col sm:flex-row '>
            <Typography variant='h5'>
              {' '}
              Visit Number: <span className='text-primary w-full'> {dataOpds?.PV1_VISIT_NUMBER}</span>
            </Typography>
            <Typography variant='h5'>
              {' '}
              Department: <span className='text-primary'>{dataOpds?.PV1_CLINIC_NAME} </span>
            </Typography>
            <Typography variant='h5'>
              {' '}
              Doctor: <span className='text-primary'>{dataOpds?.PV1_ATTENDING_DOCTOR_NAME} </span>{' '}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <MedicationStatement data={dataOpds?.Medicine} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant='outlined' color='secondary'>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog maxWidth='lg' fullWidth open={labDialog} onClose={handleDialogClose}>
        <DialogTitle>
          <div>
            <Typography variant='h3'>Lab</Typography>
          </div>
          <div className='flex flex-col sm:flex-row '>
            <Typography variant='h5'>
              {' '}
              Visit Number: <span className='text-primary w-full'> {dataOpds?.PV1_VISIT_NUMBER}</span>
            </Typography>
            <Typography variant='h5'>
              {' '}
              Department: <span className='text-primary'>{dataOpds?.PV1_CLINIC_NAME} </span>
            </Typography>
            <Typography variant='h5'>
              {' '}
              Doctor: <span className='text-primary'>{dataOpds?.PV1_ATTENDING_DOCTOR_NAME} </span>{' '}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <Observation data={dataOpds?.Lab} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant='outlined' color='secondary'>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog maxWidth='lg' fullWidth open={fileScanDialog} onClose={handleDialogClose}>
        <DialogTitle>
          <div>
            <Typography variant='h3'>Lab</Typography>
          </div>
          <div className='flex flex-col sm:flex-row '>
            <Typography variant='h5'>
              {' '}
              Visit Number: <span className='text-primary w-full'> {dataOpds?.PV1_VISIT_NUMBER}</span>
            </Typography>
            <Typography variant='h5'>
              {' '}
              Department: <span className='text-primary'>{dataOpds?.PV1_CLINIC_NAME} </span>
            </Typography>
            <Typography variant='h5'>
              {' '}
              Doctor: <span className='text-primary'>{dataOpds?.PV1_ATTENDING_DOCTOR_NAME} </span>{' '}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <FileScan data={dataOpds?.Lab} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant='outlined' color='secondary'>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

Row.propTypes = {
  dataOpds: PropTypes.shape({
    PV1_VISIT_NUMBER: PropTypes.string,
    PV1_ADMIT_DATE_TIME: PropTypes.string,
    PV1_CLINIC_NAME: PropTypes.string,
    PV1_PATIENT_CLASS: PropTypes.string,
    PV1_ATTENDING_DOCTOR_NAME: PropTypes.string,
    Diag: PropTypes.array,
    Procedure: PropTypes.array,
    Medicine: PropTypes.array,
    Lab: PropTypes.array
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired, // New prop to check if the row is expanded
  onToggle: PropTypes.func.isRequired // New prop to handle row expansion
}

const formatBirthDate = dateString => {
  const year = parseInt(dateString.substring(0, 4), 10)
  const month = parseInt(dateString.substring(4, 6), 10) - 1
  const day = parseInt(dateString.substring(6, 8), 10)

  const birthDate = new Date(year, month, day)

  return birthDate.toISOString()
}

const OpdTable = ({ dataOpds, loading, patientData, hospitalList }) => {
  const [sendReferModal, setSendReferModal] = React.useState(false)
  const { data: session, status } = useSession()
  const [urgency, setUrgency] = React.useState('')
  const [consultationNotes, setConsultationNotes] = React.useState('')
  const consultationNotesRef = React.useRef(null)
  const [sidePanelComponent, setSidePanelComponent] = React.useState(null)
  const [expandedRowIndex, setExpandedRowIndex] = React.useState(null)
  const searchParams = useSearchParams()
  const router = useRouter()
 

  const handleRowToggle = index => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index) // Toggle the row
  }

  const handleBlur = () => {
    // Only update state when input loses focus

    setConsultationNotes(consultationNotesRef.current.value)

  }

  const handleReferSubmit = async () => {
    // const urgency = urgencyRef.current?.value

    // Basic validation
    if (!urgency) {
      alert('Please select an urgency level.')
      return
    }

    const createPatientObj = {
      hospitalId: session?.user?.hospitalId,
      isActive: true,
      address: '-',
      amphur: '-',
      amphurId: 1001,
      birthDate: formatBirthDate(patientData.PID_PATIENT_DATE_TIME_OF_BIRTH),
      bloodtype: 'ไม่ระบุ',
      congenitalDisease: '',
      drugAllergy: '',
      education: 'ไม่ระบุ',
      email: '',
      file: '',
      firstnameEN: '',
      firstnameTH: patientData.PID_PATIENT_NAME,
      gender: 'หญิง',
      hn: '',
      idCardNumber: patientData?.PID_PATIENT_IDENTIFIER_LIST,
      lastnameEN: '',
      lastnameTH: patientData.PID_PATIENT_LASTNAME,
      mainTreatmentRights: '-',
      maritalOptions: 'ไม่ระบุ',
      mentalhealth: '',
      nationality: 'ไม่ระบุ',
      nickname: '',
      note: '',
      note2: '',
      passportNumber: '',
      province: '-',
      provinceId: 1,
      relation: [],
      religion: 'ไม่ระบุ',
      secondaryTreatmentRights: '-',
      tag: '',
      tambon: '-',
      tambonId: 100101,
      tel: patientData?.PID_PATIENT_PHONE_NUMBER_BUSINESS,
      title: 'ไม่ระบุ',
      zipCode: '10200'
    }
    const user_dspname = searchParams.get('user_dspname')
    const user_department = searchParams.get('user_department')
    // Prepare the form data for submission
    const formPayload = {
      name: `${patientData.PID_PATIENT_NAME}` + ' ' + `${patientData.PID_PATIENT_LASTNAME}`,
      referDate: new Date().toISOString(),
      destinationHospital: 'โรงพยาบาลตากสิน',
      department: user_department ? user_department : '',
      departmentId: 1,
      refer_by: user_dspname ? user_dspname : '',
      urgent: parseInt(urgency),
      status: '1',
      hospital_id: session?.user?.hospitalId,
      originHospital: hospitalList.find(hospital => hospital.id == session.user.hospitalId).name,
      // hn: session?.user?.hn,
      note: consultationNotes,
      id_card: patientData?.PID_PATIENT_IDENTIFIER_LIST
    }
    const urgency_msg = urgency === '0' ? 'Elective' : urgency === '1' ? 'Urgent' : 'Emergency'
    const msg_originalHospital = hospitalList.find(hospital => hospital.id == session.user.hospitalId).name
    const meg_noitify = `🚑มีปรึกษาผู้ป่วยโรคหัวใจ: ${patientData.PID_PATIENT_NAME} ${patientData.PID_PATIENT_LASTNAME} || ความเร่งด่วน: ${urgency_msg} || จากโรงพยาบาล: ${msg_originalHospital} ||  ดูรายละเอียด https://refer-aps2.vercel.app/en/login`
    try {
      const patient = await axios.post(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/customer`,
        {
          ...createPatientObj
        },
        {
          headers: {
            Authorization: `${session.user.token}`
          }
        }
      )
      console.log("patient",patient)

      if (patient && patient.data.customer.id) {
 
          const patientId = patient.data.customer.id
          const refer = await axios.post(
            `${process.env.NEXT_PUBLIC_TEST_API_URL}/referList`,
            {
              ...formPayload,
              customer_id: patientId
            },
            {
              headers: {
                Authorization: `${session.user.token}`
              }
            }
          ) 
          if (refer.data.response === false) {
            //ตรวจสอบรายการซ้ำหากมีสถานะ รอปรึกษาจะเพิ่มไม่ได้
            toast.warning('มีคนไข้ในระบบแล้วไม่สามารถส่งปรึกษาได้', {
              position: 'top-right',
              autoClose: 3000, // 5 seconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false
            })
          } else {
            //เพิ่ม object hospitalNotifyGroups
            const hospitalNotifyGroups = {
              14: [3, 6],
              15: [3, 5],
              17: [3, 4],
              18: [3, 7]
            }

            // ถ้ามี hospitalId ที่ตรงกับเงื่อนไข ให้ส่ง line notify
            if (hospitalNotifyGroups[session.user.hospitalId]) {
              try {
                const notify_msg = await axios.post(
                  `${process.env.NEXT_PUBLIC_TEST_API_URL}/send_line_notify`,
                  {
                    message: meg_noitify,
                    groupId: hospitalNotifyGroups[session.user.hospitalId]
                  },
                  {
                    headers: {
                      Authorization: token
                    }
                  }
                )
                console.log('Line notify sent successfully')
              } catch (error) {
                // จัดการ error แต่ยังให้โค้ดทำงานต่อไปได้
                console.error('Failed to send Line notification:', error.message)
              }
            }
            setSendReferModal(false)
            toast.success('บันทึกข้อมูลสำเร็จ!', {
              position: 'top-right',
              autoClose: 5000, // 5 seconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false
            })
            router.push('/pages/refer')
          }
          
          // Your axios request goes here
 
        
      }

      console.log(patient.data.customer)
    } catch (error) {
      console.error(error)
    }

    console.log('Submitting referral:', formPayload)

    // Close the modal after submission
  }
  const handleClose = () => {
    setSendReferModal(false)
  }
  return (
    <>
      <Card>
        <div className='flex flex-row justify-end m-4'>
          <Button
            disabled={dataOpds.length <= 0}
            variant='contained'
            color='success'
            size='medium'
            onClick={() => {
              setSendReferModal(true)
            }}
          >
            <i className='tabler-check text-[22px] text-white mr-3' />
            ส่งปรึกษา
          </Button>
        </div>

        <div className='flex  flex-col md:flex-row transition-all duration-300 ease-in-out px-6'>
          {/* Table Container */}
          <div className={`transition-all duration-300 ease-in-out ${sidePanelComponent ? 'w-6/12' : 'w-full'}`}>
            <TableContainer
              component={Paper}
              className={`transition-all duration-300 ease-in-out mt-12  overflow-y-auto max-h-[60vh] md:max-h-40vh]`} // Change width based on sidePanelComponent presence
            >
              <Table aria-label='collapsible table'>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Admit Date</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Category</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align='center'>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : dataOpds.length > 0 ? (
                    dataOpds.map((row, index) => (
                      <Row
                        key={index}
                        dataOpds={row}
                        setSidePanelComponent={setSidePanelComponent}
                        isExpanded={expandedRowIndex === index} // Only expand the currently selected row
                        onToggle={() => handleRowToggle(index)} // Handle row toggle
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align='center'>
                        <DataNotFound />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* <TextField
              disabled={loading}
              label='Consultation Notes'
              className={`transition-none p-2 ${sidePanelComponent ? 'w-6/12' : 'w-6/12'} my-4`}
              name='consultationNotes'
              defaultValue={consultationNotes} // Uncontrolled input
              inputRef={consultationNotesRef} // Use ref to get the input value
              onBlur={handleBlur} // Trigger state update only on blur
              multiline
              rows={5}
            /> */}
            <div className='flex flex-col sm:flex-row mb-2'>
            <div className={`transition-none p-2 ${sidePanelComponent ? 'w-6/12' : 'w-full sm:w-6/12'} my-2`}>
                <InputLabel htmlFor='consultationNotes' className={`text-sm font-medium`}>
                  Consultation Notes
                </InputLabel>
                <TextField
                  id='consultationNotes'
                  name='consultationNotes'
                  defaultValue={consultationNotes} // Uncontrolled input
                  inputRef={consultationNotesRef} // Use ref to get the input value
                  onBlur={handleBlur} // Trigger state update only on blur
                  multiline
                  rows={5}
                  fullWidth
                />
              </div>

            </div>


          </div>

          {/* Side Panel Container */}
          {sidePanelComponent ? (
            <>
              <div className='w-6/12 p-4 transition-all duration-300 ease-in-out'>
                <div className='flex justify-start mb-2'>
                  <Button variant='outlined' color='error' onClick={() => setSidePanelComponent(null)}>
                    <i className={`tabler tabler-x`}></i>
                  </Button>
                </div>
                {sidePanelComponent}
              </div>
            </>
          ) : null}
        </div>
      </Card>

      <Dialog
        fullWidth
        maxWidth='lg'
        className='h-96vh'
        open={sendReferModal}
        aria-labelledby='send-refer-dialog'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='form-dialog-title'>ยืนยันส่งปรึกษา</DialogTitle>
        <Divider />
        <DialogContent className='h-96'>
          <FormControl fullWidth className='space-y-10'>
            <div className='p-4 border-l-8 border-amber-500 bg-white shadow-md rounded-md space-y-1'>
              <Typography variant='h5' className='mb-2'>
                รายละเอียดคนไข้
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>
                ชื่อ-นามสกุล:{' '}
                <span className='text-amber-500'>
                  {patientData?.PID_PATIENT_NAME} {patientData?.PID_PATIENT_LASTNAME}
                </span>
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>
                เลขบัตรประชาชน: <span className='text-amber-500'>{patientData?.PID_PATIENT_IDENTIFIER_LIST}</span>
              </Typography>
            </div>
            <div className='w-full flex flex-col sm:flex-row'>
              <CustomTextField
                className='w-full sm:w-3/12  py-2 sm:mx-2'
                // labelId='urgency'
                select
                name='urgency'
                size='small'
                label='ความเร่งด่วน'
                value={urgency}
                onChange={e => setUrgency(e.target.value)} // Attach ref to Select
              >
                <MenuItem className='text-secondary' value='0'>
                  Elective
                </MenuItem>
                <MenuItem className='text-warning' value='1'>
                  Urgency
                </MenuItem>
                <MenuItem className='text-error' value='2'>
                  Emergency
                </MenuItem>
              </CustomTextField>

              <AppReactDatepicker
                selected={Date.now()}
                disabled
                customInput={<CustomTextField className='py-2 sm:mx-2' label='วันที่รับรายการ' fullWidth />}
              />
              {/* <CustomAutocomplete
               select>
                <MenuItem className='text-error' value={0}>
                  Elective
                </MenuItem>
                <MenuItem className='text-warning' value={1}>
                  Urgency
                </MenuItem>
                <MenuItem className='text-secondary' value={2}>
                  Emergency
                </MenuItem>
              </CustomAutocomplete> */}
              {/* <CustomTextField fullWidth>
            </CustomTextField> */}
            </div>
            {/* <div className='w-full flex flex-row space-x-2'>
              <TextField
                label='Doctor Notes'
                className='w-full mx-2'
                name='doctorNotes'
                defaultValue={doctorNotes} // Uncontrolled input
                inputRef={doctorNotesRef} // Use ref to get the input value
                onBlur={handleBlur} // Trigger state update only on blur
                multiline
                rows={5}
              />
            </div> */}
            <div className='flex flex-row'>
              <div className={`transition-none  w-full`}>
              Consultation Notes:
                <TextField
                  id='consultationNotes'
                  name='consultationNotes'
                  defaultValue={consultationNotes} // Uncontrolled input
                  inputRef={consultationNotesRef} // Use ref to get the input value
                  onBlur={handleBlur} // Trigger state update only on blur
                  multiline
                  rows={5}
                  fullWidth
                />
              </div>

            </div>
          </FormControl>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant='outlined' color='primary' onClick={handleReferSubmit}>
            ยืนยัน
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OpdTable
