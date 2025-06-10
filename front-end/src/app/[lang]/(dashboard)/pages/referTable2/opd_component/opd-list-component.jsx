'use client'
import React from 'react'
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
  Divider,
  TablePagination,
  TableSortLabel,
  InputAdornment,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Grid,
  FormHelperText,
  FormControl,
  Select,
  MenuItem,
  TextField,
  useMediaQuery
} from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'
import CustomTextField from '@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DataNotFound from '@/views/DataNotFound'
import Procedure from './procedure'
import MedicationStatement from './medication-statement'
import Observation from './observation'
import DiagnosticList from './diagnostic-list'
import VitalSigns from './vital-signs'
import FileScan from './file-scan'
import EOpdCard from './e-opd-card'
import PropTypes from 'prop-types'
import { useSession } from 'next-auth/react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
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
          {dataOpds?.Hospital.name}
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
                          hos_id={dataOpds?.VS1_HOSPITALCODE}
                        />
                      </div>
                    )
                  }
                }}
                
                style={{
                  backgroundColor:  '#FF0000' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-letter-e w-5 h-5 text-white`}
                ></i>
              </button>
            </span>
          </Tooltip>
          <Tooltip
            title='File Scan'
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
                      <FileScan
                        data={dataOpds?.file_scan}
                        date={dataOpds?.PV1_ADMIT_DATE_TIME}
                        SETID_PV1={dataOpds?.SETID_PV1}
                        hn={params.get('id_card')}
                        hos_id={dataOpds?.VS1_HOSPITALCODE}
                      />
                    </div>
                  )
                }} 
                style={{
                  backgroundColor:  '#FFA24C' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-letter-s w-5 h-5 text-white`}
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
    Lab: PropTypes.array,
    isExpanded: PropTypes.bool.isRequired, // New prop to check if the row is expanded
    onToggle: PropTypes.func.isRequired // New prop to handle row expansion
  }).isRequired
}

const OpdTable = ({ dataOpds, loading, hospitalList, user }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [isRefer, setIsRefer] = React.useState(false)
  // const [doctorNotes, setDoctorNotes] = React.useState('teest')
  const [sidePanelComponent, setSidePanelComponent] = React.useState(null)
  const [urgency, setUrgency] = React.useState(null)

  // const doctorNotesRef = React.useRef(null)

  const [consultationNotes, setConsultationNotes] = React.useState('')
  const consultationNotesRef = React.useRef(null)

  const [expandedRowIndex, setExpandedRowIndex] = React.useState(null)
  const handleRowToggle = index => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index) // Toggle the row
  }
  const handleClose = () => {
    setIsRefer(false)
  }

  const handleReferSubmit = async id => {
    console.log(hospitalList)
    // const urgency = urgencyRef.current?.value

    // // Basic validation
    // if (!urgency) {
    //   alert('Please select an urgency level.')
    //   return
    // }

    const token = session.user.token
    const refer_id = user ? user.id : ''
    console.log('refer_id', refer_id)
    console.log('user', user)
    const data = {
      destinationHospital: 'โรงพยาบาลตากสิน',
      referDate: new Date().toISOString(),
      department: '',
      departmentId: 1,
      refer_by: session.user.name,
      urgent: parseInt(urgency),
      name: user.firstnameTH + ' ' + user.lastnameTH,
      hospital_id: session.user.hospitalId,
      originHospital: hospitalList.find(hospital => hospital.id == session.user.hospitalId).name,
      status: '1', // อัพเดตสถานะเป็นรับเข้ารักษา
      hn: user?.hn,
      customer_id: user.id,
      dest_hospital_id: 2,
      id_card: user.idCardNumber,
      note: consultationNotes,
      id: refer_id
    }
    const urgency_msg = urgency === '0' ? 'Elective' : urgency === '1' ? 'Urgent' : 'Emergency'
    console.log('SubmitData', data)
    const meg_noitify = `🚑มีปรึกษาผู้ป่วยโรคหัวใจ: ${user.firstnameTH} ${user.lastnameTH} || ความเร่งด่วน: ${urgency_msg} || จากโรงพยาบาล: ${data.originHospital} || ดูรายละเอียด https://refer-aps2.vercel.app/en/login`

    try {
      const refer = await axios.post(`${process.env.NEXT_PUBLIC_TEST_API_URL}/referList`, data, {
        headers: {
          Authorization: token
        }
      })

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
        };
  
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
            );
            console.log('Line notify sent successfully');
          } catch (error) {
            // จัดการ error แต่ยังให้โค้ดทำงานต่อไปได้
            console.error('Failed to send Line notification:', error.message);
          }
        }
        
        setIsRefer(false)
        toast.success('บันทึกข้อมูลสำเร็จ!', {
          position: 'top-right',
          autoClose: 5000, // 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false
        })
        router.push('/pages/refer')
      }


      console.log('refer', refer)
      // Your axios request goes here
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล ลองใหม่อีกครั้ง')
      console.log(error)
    }
  }
  const handleReferCancel = async id => {
    const token = session.user.token
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${id}`,
        {
          status: '4' // อัพเดตสถานะเป็นยกเลิก
        },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      setIsRefer(false)
      toast.success('บันทึกข้อมูลสำเร็จ!', {
        position: 'top-right',
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false
      })
      router.push('/pages/pending-refer')
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด')
      console.log(error)
    }
  }
  const handleBlur = () => {
    // Only update state when input loses focus
    // setDoctorNotes(doctorNotesRef.current.value)
    setConsultationNotes(consultationNotesRef.current.value)
  }
  return (
    <>
      <Card>
        <Grid container className='flex justify-end p-4 space-x-2'>
          <Button
            variant='contained'
            size='medium'
            color='success'
            onClick={() => {
              setIsRefer(true)
            }}
          >
            <i className='tabler-check text-[22px] text-white mr-3' /> ส่งปรึกษา
          </Button>

          {/* <Button
            variant='contained'
            color='error'
            onClick={() => {
              setIsCancel(true)
            }}
          >
            <i className='tabler-x text-[22px]  text-white mr-3' />
            ยกเลิกส่งตัว
          </Button> */}
        </Grid>
        <div className='flex  flex-col md:flex-row transition-all duration-300 ease-in-out p-6'>
          {/* Table Container */}
          <div className={`transition-all duration-300 ease-in-out ${sidePanelComponent ? 'w-6/12' : 'w-full'}`}>
            <TableContainer
              component={Paper}
              className={`transition-all duration-300 ease-in-out mt-12  overflow-y-auto max-h-[80vh] border-l-8 border-indigo-500`} // Change width based on sidePanelComponent presence
            >
              <Table aria-label='collapsible table'>
                <TableHead className='' style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                  <TableRow>
                    <TableCell />
                    <TableCell>Admit Date</TableCell>
                    <TableCell>Hospital</TableCell>
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
                        onToggle={() => handleRowToggle(index)}
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
      <Dialog fullWidth maxWidth='lg' open={isRefer} aria-labelledby='send-refer-dialog'>
        <DialogTitle id='form-dialog-title'>ยืนยันส่งปรึกษา</DialogTitle>
        <Divider />
        <DialogContent className='h-96 '>
          <FormControl fullWidth className='space-y-10'>
            <div className='p-4 border-l-8 border-amber-500 bg-white shadow-md rounded-md space-y-1'>
              <Typography variant='h5' className='mb-2'>
                รายละเอียดคนไข้
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>
                ชื่อ-นามสกุล:{' '}
                <span className='text-amber-500'>
                  {user?.firstnameTH} {user?.lastnameTH}
                </span>
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>
                เลขบัตรประชาชน: <span className='text-amber-500'>{user?.idCardNumber}</span>
              </Typography>
            </div>
            <div className='w-full  flex flex-col sm:flex-row '>
              <CustomTextField
                className='w-full sm:w-3/12 mx-2'
                labelId='urgency'
                select
                // name='urgency'
                value={urgency}
                size='small'
                label='ความเร่งด่วน'
                onChange={e => setUrgency(e.target.value)}
                // inputRef={urgencyRef} // Attach ref to Select
              >
                <MenuItem className='text-secondary' value={'0'}>
                  Elective
                </MenuItem>
                <MenuItem className='text-warning' value={'1'}>
                  Urgency
                </MenuItem>
                <MenuItem className='text-error' value={'2'}>
                  Emergency
                </MenuItem>
              </CustomTextField>

              <AppReactDatepicker
                selected={Date.now()}
                disabled
                customInput={<CustomTextField className='mx-2' label='วันที่รับรายการ' fullWidth />}
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
            <div className='w-full flex flex-row space-x-2'>
              <TextField
                label='Consultation Notes'
                className='w-full mx-2'
                name='consultationNote'
                defaultValue={consultationNotes} // Uncontrolled input
                inputRef={consultationNotesRef} // Use ref to get the input value
                onBlur={handleBlur} // Trigger state update only on blur
                multiline
                rows={5}
              />
            </div>
          </FormControl>
        </DialogContent>
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
