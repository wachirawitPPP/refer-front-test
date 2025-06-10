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
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material'
import axios from 'axios'
import { toast } from 'react-toastify'
import DataNotFound from '@/views/DataNotFound'
import Procedure from '../opd-component/procedure'
import MedicationStatement from '../opd-component/medication-statement'
import Observation from '../opd-component/observation'
import DiagnosticList from '../opd-component/diagnostic-list'
import VitalSigns from '../opd-component/vital-signs'
import FileScan from '../opd-component/file-scan'
import EOpdCard from '../opd-component/e-opd-card'
import PropTypes from 'prop-types'
import { useSession } from 'next-auth/react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
function Row(props) {
  const { dataOpds, setSidePanelComponent, isExpanded, onToggle } = props
  const [open, setOpen] = React.useState(false)
  const [diagDialog, setDiagdialog] = React.useState(false)
  const [labDialog, setLabDialog] = React.useState(false)
  const [medDialog, setMedDialog] = React.useState(false)
  const [vaccineDialog, setVaccinDialog] = React.useState(false)
  const [fileScanDialog, setFileScanDialog] = React.useState(false)
  const [fileEmrDialog, setFileEmrDialog] = React.useState(false)
  const [procedureDialog, setProcedureDialog] = React.useState(false)

  // const isMobile = useMediaQuery('(max-width:600px)')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
    setFileEmrDialog(false)
  }
  const formatDateTime = datetime => {
    if (!datetime) return ''

    // Extract components from the compact datetime string
    const year = datetime.slice(0, 4)
    const month = datetime.slice(4, 6)
    const day = datetime.slice(6, 8)
    const hour = datetime.slice(8, 10)
    const minute = datetime.slice(10, 12)
    const second = datetime.slice(12, 14)

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
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
          >
            <span>
              <button
                onClick={() => {
                  if (isMobile) {
                    setFileEmrDialog(true)
                  } else {
                    setSidePanelComponent(
                      <div>
                        <Typography variant='h5' className=''>
                          {dataOpds?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || ''}-{dataOpds?.PV1_CLINIC_NAME}{' '}
                          {formatDateTime(dataOpds?.PV1_ADMIT_DATE_TIME)}
                        </Typography>
                        {/* <FileScan data={dataOpds?.file_scan} /> */}
                        <EOpdCard
                          data={dataOpds?.file_scan}
                          date={dataOpds?.PV1_ADMIT_DATE_TIME}
                          SETID_PV1={dataOpds?.SETID_PV1}
                          hn={params.get('id_card')}
                          hos_id={dataOpds?.PV1_HOSPITALCODE}
                        />
                      </div>
                    )
                  }
                }}
                style={{
                  backgroundColor: '#FF0000' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i className={`tabler tabler-letter-e w-5 h-5 text-white`}></i>
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
                  if (isMobile) {
                    setFileScanDialog(true)
                  } else {
                  setSidePanelComponent(
                    <div>
                      <Typography variant='h5' className=''>
                        {dataOpds?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || ''}-{dataOpds?.PV1_CLINIC_NAME}-
                        {formatDateTime(dataOpds?.PV1_ADMIT_DATE_TIME)}
                      </Typography>
                      {/* <EOpdCard data={dataOpds?.file_scan} /> */}
                      <FileScan 
                      data={dataOpds?.file_scan}
                      date={dataOpds?.PV1_ADMIT_DATE_TIME}
                      SETID_PV1={dataOpds?.SETID_PV1}
                      hn={params.get('id_card')}
                      hos_id={dataOpds?.PV1_HOSPITALCODE}
                      />
                    </div>
                  )
                }
                }}
                // disabled={checkNullData(dataOpds?.Lab)}
                style={{
                  //backgroundColor: checkNullData(dataOpds?.Lab) ? '#e3e5e0' : '#FFA24C' 
                  backgroundColor: '#FFA24C' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  //className={`tabler tabler-letter-s w-5 h-5 ${checkNullData(dataOpds?.Lab) ? 'text-gray-400' : 'text-white'}`}
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
      <Dialog
        maxWidth='lg'
        fullWidth
        open={fileEmrDialog}
        onClose={handleDialogClose}
        fullScreen={isMobile} // ใช้ fullscreen บนมือถือ
      >
        <DialogTitle>
          <div>
            <Typography variant='h3'>EMR</Typography>
          </div>
          <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4'>
            <Typography variant={isMobile ? 'h6' : 'h5'}>
              Visit Number: <span className='text-primary'>{dataOpds?.PV1_VISIT_NUMBER}</span>
            </Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'}>
              Department: <span className='text-primary'>{dataOpds?.PV1_CLINIC_NAME}</span>
            </Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'}>
              Doctor: <span className='text-primary'>{dataOpds?.PV1_ATTENDING_DOCTOR_NAME}</span>
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <EOpdCard
            data={dataOpds?.file_scan}
            date={dataOpds?.PV1_ADMIT_DATE_TIME}
            SETID_PV1={dataOpds?.SETID_PV1}
            hn={params.get('id_card')}
            hos_id={dataOpds?.VS1_HOSPITALCODE}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            variant='outlined'
            color='secondary'
            style={{
              width: isMobile ? '100%' : 'auto' // ปรับปุ่มให้เต็มความกว้างบนมือถือ
            }}
          >
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth='lg'
        fullWidth
        open={fileScanDialog}
        onClose={handleDialogClose}
        fullScreen={isMobile} // ใช้ fullscreen บนมือถือ
      >
        <DialogTitle>
          <div>
            <Typography variant='h3'>File Scan</Typography>
          </div>
          <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4'>
            <Typography variant={isMobile ? 'h6' : 'h5'}>
              Visit Number: <span className='text-primary'>{dataOpds?.PV1_VISIT_NUMBER}</span>
            </Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'}>
              Department: <span className='text-primary'>{dataOpds?.PV1_CLINIC_NAME}</span>
            </Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'}>
              Doctor: <span className='text-primary'>{dataOpds?.PV1_ATTENDING_DOCTOR_NAME}</span>
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <FileScan
            data={dataOpds?.file_scan}
            date={dataOpds?.PV1_ADMIT_DATE_TIME}
            SETID_PV1={dataOpds?.SETID_PV1}
            hn={params.get('id_card')}
            hos_id={dataOpds?.VS1_HOSPITALCODE}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            variant='outlined'
            color='secondary'
            style={{
              width: isMobile ? '100%' : 'auto' // ปรับปุ่มให้เต็มความกว้างบนมือถือ
            }}
          >
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

const OpdTable = ({ dataOpds, loading, referDetails, hospitalList, refer }) => {
  console.log(refer)
  const router = useRouter()

  const { data: session } = useSession()
  const [isRefer, setIsRefer] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [isCancel, setIsCancel] = React.useState(false)
  const [isForward, setIsForward] = React.useState(false)
  const [isSendback, setIsSendback] = React.useState(false)

  const [destinationHospital, setDestinationHospital] = React.useState(2)
  const [departmentList, setDepartmentList] = React.useState([])
  const [destinationDepartments, setDestinationDepartments] = React.useState(0)
  const [urgency, setUrgency] = React.useState(referDetails.urgent)

  const [hospitalError, setHospitalError] = React.useState(false)
  const [departmentError, setDepartmentError] = React.useState(false)

  const [doctorNotes, setDoctorNotes] = React.useState(referDetails.doctor_note)
  const doctorNotesRef = React.useRef(null)
  const [nurseNotes, setNurseNotes] = React.useState(referDetails.nurse_note)

  const [consultationNotes, setConsultationNotes] = React.useState(referDetails.note)
  const consultationNotesRef = React.useRef(null)
  const [registNotes, setRegisNotes] = React.useState(referDetails.regis_note)
  const [sidePanelComponent, setSidePanelComponent] = React.useState(null)
  const [expandedRowIndex, setExpandedRowIndex] = React.useState(null)
  const [serviceType, setServiceType] = React.useState('')
  const [dialogSMS, setDialogSMS] = React.useState(false)
  const [textSMS, setTextSMS] = React.useState('นัดสวนหัวใจ ติดต่อหน่วยตรวจสวนหัวใจและหลอดเลือด')
  const [messageSMS, setMessageSMS] = React.useState('')
  const [patientPhone, setPatientPhone] = React.useState('')
  const [isValidPhone, setIsValidPhone] = React.useState(true)
  const [appointmentData, setAppointmentData] = React.useState(null)
  const [dataOpd, setDataopd] = React.useState(dataOpds)
  const [sendData, setSendData] = React.useState(false)
  const [time, setTime] = React.useState('')
  const [dateTime, setDateTime] = React.useState(new Date())
  const [dateError, setDateError] = React.useState(false)
  const [timeError, setTimeError] = React.useState(false)
  const CloseDialogSMS = () => {
    setDialogSMS(false)
    setNurseNotes('')
    setPatientPhone('')
    setTime('')
    setTextSMS('')
    setMessageSMS('')
    setSendData(false)
    setDateTime(new Date())
  }
  const ClearMessage = () => {
    setNurseNotes('')
    setPatientPhone('')
    setTime('')
    setTextSMS('')
    setMessageSMS('')
    setSendData(false)
    setDateTime(new Date())
  }
  const handleAppointmentSave = () => {
    setDateError(!dateTime)
    setTimeError(!time)
    setSendData(true)

    if (!dateTime || !time || !patientPhone || !isValidPhone) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน!')
      return
    }

    if (dateTime.toISOString().substring(0, 10) === new Date().toISOString().substring(0, 10)) {
      toast.error('ไม่สามารถนัดหมายในวันนี้ได้!')
      return
    }
    const thaiMonths = [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      'เม.ย.',
      'พ.ค.',
      'มิ.ย.',
      'ก.ค.',
      'ส.ค.',
      'ก.ย.',
      'ต.ค.',
      'พ.ย.',
      'ธ.ค.'
    ]
    const appointmentDetails = {
      patientName: referDetails?.Customer?.firstnameTH + ' ' + referDetails?.Customer?.lastnameTH || '',
      patientAge: referDetails?.Customer?.birthDate || '',
      clinic: dataOpd[0].PV1_CLINIC_NAME || '',
      phoneNumber: patientPhone,
      appointmentDate: dateTime ? new Date(dateTime).toISOString().split('T')[0] : '',
      appointmentTime: time
    }
    const DatetoSMS = dateTime
      ? `วันที่ ${dateTime.getDate()} ${thaiMonths[dateTime.getMonth()]} ${dateTime.getFullYear() + 543}`
      : ''
    const hotspitalSMS = dataOpd ? dataOpd[0].Hospital.name : ''
    const ClinicSMS = dataOpd ? dataOpd[0].PV1_CLINIC_NAME : ''
    const pt_name = referDetails ? referDetails?.Customer?.firstnameTH + ' ' + referDetails?.Customer?.lastnameTH : ''
    setAppointmentData(appointmentDetails)
    setMessageSMS(
      `เรียน คุณ${pt_name} ท่านมี${textSMS} รพ. ตากสิน ชั้น 8 ${DatetoSMS} เวลา ${time} น. เพื่อนอน รพ. สอบถามเพิ่มเติมโทร 02-4370123 ต่อ 1806`
    )
    console.log('Appointment Details:', appointmentDetails)
  }
 
  const SendSMS = async (nurseNotes) => {
    if(!messageSMS) {
      toast.error('กรุณากด บันทึก เพื่อยืนยันการส่ง SMS!')
      return
    }
     
    try {
      // Validate required fields
      // if (!dateTime || !time || !patientPhone || !messageSMS) {
      //   toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
      //   return
      // }
  
      const appointmentDetails = {
        appt_date: dateTime ? new Date(dateTime).toISOString().split('T')[0] : '',
        appt_time: time,
        appt_notes: '',
        nurse_note: nurseNotes,
        msisdn: patientPhone,
        message: messageSMS,
        status_sms: '2',
        sender: session?.user?.name || ''
      }
  
      const refer_id = referDetails?.id
      if (!refer_id) {
        toast.error('ไม่พบข้อมูล Refer ID')
        return
      }
  
      const token = session?.user?.token
      if (!token) {
        toast.error('กรุณาเข้าสู่ระบบใหม่')
        return
      }
  
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/appt_sendsms/${refer_id}`,
        appointmentDetails,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
  
      if (res.data) {
        toast.success('ส่ง SMS สำเร็จ')
        CloseDialogSMS() // Close dialog after successful send
      }
  
    } catch (error) {
      console.error('SMS sending error:', error)
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการส่ง SMS กรุณาลองใหม่อีกครั้ง')
    }
  }

  const handlePhoneNumberChange = e => {
    const value = e.target.value
    const regex = /^0\d{8,9}$/ // รองรับเบอร์มือถือ 10 หลัก และเบอร์บ้าน 9 หลัก
    setPatientPhone(value)
    setIsValidPhone(regex.test(value))
  }

  const formatAge = value => {
    if (value) {
      var mdate = value.toString()
      var dobYear = parseInt(mdate.substring(0, 4), 10)
      var dobMonth = parseInt(mdate.substring(5, 7), 10)
      var dobDate = parseInt(mdate.substring(8, 10), 10)

      //get the current date from system
      var today = new Date()
      //date string after broking
      var birthday = new Date(dobYear, dobMonth - 1, dobDate)

      //calculate the difference of dates
      var diffInMillisecond = today.valueOf() - birthday.valueOf()

      //convert the difference in milliseconds and store in day and year variable
      var year_age = Math.floor(diffInMillisecond / 31536000000)
      var day_age = Math.floor((diffInMillisecond % 31536000000) / 86400000)

      //when birth date and month is same as today's date
      if (today.getMonth() == birthday.getMonth() && today.getDate() == birthday.getDate()) {
        alert('Happy Birthday!')
      }

      var month_age = Math.floor(day_age / 30)
      var day_ageday_age = day_age % 30

      var tMnt = month_age + year_age * 12
      // var tDays = tMnt * 30 + day_age;
      return `${year_age}ปี ${month_age}เดือน ${day_ageday_age}วัน`
    }
  }

  const handleRowToggle = index => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index) // Toggle the row
  }
  const handleClose = () => {
    setIsRefer(false)
    setIsSuccess(false)
    setIsCancel(false)
    setIsForward(false)
    setIsSendback(false)
  }
  const handleBlur = () => {
    // Only update state when input loses focus
    setDoctorNotes(doctorNotesRef.current.value)
    setConsultationNotes(consultationNotesRef.current.value)

    // setRegisNotes(registNotesRef.current.value)
  }

  React.useEffect(() => {
    if (destinationHospital) {
      const selectedHospital = hospitalList.find(hospital => hospital.id === destinationHospital)
      setDepartmentList(selectedHospital?.departments || [])
    }

    const defaultDepartment = departmentList.find(department => department.name === 'อายุรกรรม')

    if (defaultDepartment) {
      setDestinationDepartments(defaultDepartment.id) // ใช้ setState ในการตั้งค่า default
    }
  }, [destinationHospital, hospitalList, departmentList])

  const handleDesinationHospitalChange = value => {
    setDestinationHospital(value)
    if (value !== 0) setHospitalError(false) // Clear error when valid selection is made
  }

  const handleDesinationDepartmentChange = value => {
    setDestinationDepartments(value)
    if (value !== 0) setDepartmentError(false) // Clear error when valid selection is made
  }

  const handleNurseNotesSubmit = async (id, note) => {
    if (note !== 'ตอบปรึกษา ทำใบนัดและส่ง SMS') { 
      console.log('checkOnclick', note)
      const token = session.user?.token
      try {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${id}`,
          {
            nurse_note: note
          },
          {
            headers: {
              Authorization: `${token}`
            }
          }
        )
        toast.success('บันทึกข้อมูลสำเร็จ!', {
          position: 'top-right',
          autoClose: 5000, // 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false
        })
        router.push('/pages/pending-refer')
      } catch (error) {
        toast.error('เกิดข้อผิดพลาด โปรดลองอีกครั้ง!', {
          position: 'top-right',
          autoClose: 5000, // 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false
        })
      }
    } 
  }
  const handleRegistNotesSubmit = async (id, note) => {
    const token = session.user?.token
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${id}`,
        {
          regis_note: note
        },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      toast.success('บันทึกข้อมูลสำเร็จ!', {
        position: 'top-right',
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false
      })
      router.push('/pages/pending-refer')
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด โปรดลองอีกครั้ง!', {
        position: 'top-right',
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false
      })
    }
  }

  const handleNoteSubmit = async id => {
    const token = session.user?.token
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${id}`,
        {
          note: consultationNotes
        },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      toast.success('บันทึกข้อมูลสำเร็จ!', {
        position: 'top-right',
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false
      })
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด โปรดลองอีกครั้ง!', {
        position: 'top-right',
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false
      })
    }
  }

  const handleReplyNoteSubmit = async (id) => {
    
    const token = session.user?.token
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${id}`,
        {
          doctor_note: doctorNotes
        },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      toast.success('บันทึกข้อมูลสำเร็จ!', {
        position: 'top-right',
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false
      })
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด โปรดลองอีกครั้ง!', {
        position: 'top-right',
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false
      })
    }
  }

  const handleForwardSubmit = async (id, user) => {
    const token = session.user?.token
    const meg_noitify = `🚑แพทย์หัวใจตอบปรึกษาแล้ว: ${user.firstnameTH} ${user.lastnameTH} || สถานะ: ส่งต่อ || ดูรายละเอียด https://refer-aps2.vercel.app/en/login`
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${id}`,
        {
          doctor_note: doctorNotes,
          status: '5'
        },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
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
      toast.success('บันทึกข้อมูลสำเร็จ!', {
        position: 'top-right',
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false
      })
      setIsForward(false)
      router.push('/pages/pending-refer')
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด โปรดลองอีกครั้ง!', {
        position: 'top-right',
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false
      })
    }
  }

  const handleSendbackSubmit = async (id, user) => {
    const token = session.user?.token
    const meg_noitify = `🚑แพทย์หัวใจตอบปรึกษาแล้ว: ${user.firstnameTH} ${user.lastnameTH} || สถานะ: ส่งกลับ || ดูรายละเอียด https://refer-aps2.vercel.app/en/login`
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${id}`,
        {
          doctor_note: doctorNotes,
          status: '6'
        },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
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
      toast.success('บันทึกข้อมูลสำเร็จ!', {
        position: 'top-right',
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false
      })
      setIsForward(false)
      router.push('/pages/pending-refer')
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด โปรดลองอีกครั้ง!', {
        position: 'top-right',
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false
      })
    }
  }

  const handleReferSubmit = async (id, status, user, originhospital_id) => {
    // Validation logic
    if (destinationHospital === 0) {
      setHospitalError(true) // Set error if no hospital is selected
      return
    }

    if (destinationDepartments === 0) {
      setDepartmentError(true) // Set error if no department is selected
      return
    }

    const now = new Date();
    const bangkokTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
    // แยกวันที่
    const year = bangkokTime.getFullYear();
    const month = String(bangkokTime.getMonth() + 1).padStart(2, '0');
    const day = String(bangkokTime.getDate()).padStart(2, '0');

    const hours = String(bangkokTime.getHours()).padStart(2, '0');
    const minutes = String(bangkokTime.getMinutes()).padStart(2, '0');
    const seconds = String(bangkokTime.getSeconds()).padStart(2, '0');  
  
    // สร้างรูปแบบวันที่และเวลาแยกกัน
    const datePart = `${year}-${month}-${day}`;
    const timePart = `${hours}:${minutes}:${seconds}`;
  
    // รวมวันที่และเวลาในรูปแบบ ISO 8601
    const formattedDateTime = `${datePart}T${timePart}Z`;

    const selectedHospital = hospitalList.find(hospital => hospital.id === destinationHospital)
    const selectedDepartment = departmentList.find(department => department.id === destinationDepartments)
    const meg_noitify = `🚑แพทย์หัวใจตอบปรึกษาแล้ว: ${user.firstnameTH} ${user.lastnameTH} || สถานะ: รับส่งตัว || ดูรายละเอียด https://refer-aps2.vercel.app/en/login`
    const token = session.user.token
    const recive_by = session.user.name
    nurseNotes === '1'
      ? 'รอตอบปรึกษา'
      : nurseNotes === '2'
        ? 'ตอบปรึกษา และทำใบนัดแล้ว'
        : nurseNotes === '3'
          ? 'ตอบปรึกษา ทำใบนัดและส่ง SMS แล้ว'
          : nurseNotes === '4' || 'ตอบปรึกษา และรับเป็น IPD แล้ว'
            ? 'ตอบปรึกษา และรับเป็น IPD แล้ว'
            : nurseNotes
    const data = {
      id: id,
      dest_hospital_id: selectedHospital.id,
      destinationHospital: selectedHospital.name,
      dest_department_id: selectedDepartment.id,
      dest_department_name: selectedDepartment.name,
      status: status, // อัพเดตสถานะเป็นรับเข้ารักษา
      urgent: parseInt(urgency), // อัพเดตระดับความเร็ว
      recive_by: recive_by,
      pt_type: serviceType,
      doctor_note: doctorNotes,
      nurse_note: nurseNotes,
      regis_note: registNotes,
      confirm_date: formattedDateTime,
    }
    console.log('DataSubmit', data)

    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${id}`, data, {
        headers: {
          Authorization: `${token}`
        }
      })
      //เพิ่ม object hospitalNotifyGroups
      const hospitalNotifyGroups = {
        14: [3, 6],
        15: [3, 5],
        17: [3, 4],
        18: [3, 7]
      };

      // ถ้ามี hospitalId ที่ตรงกับเงื่อนไข ให้ส่ง line notify
      if (hospitalNotifyGroups[originhospital_id]) {
        try {
          const notify_msg = await axios.post(
            `${process.env.NEXT_PUBLIC_TEST_API_URL}/send_line_notify`,
            {
              message: meg_noitify,
              groupId: hospitalNotifyGroups[originhospital_id]
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
      // Your axios request goes here
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
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล ลองใหม่อีกครั้ง')
      console.log(error)
    }
  }
  const handleReferCancel = async (id, user) => {
    const token = session.user.token
    const meg_noitify = `🚑แพทย์หัวใจตอบปรึกษาแล้ว: ${user.firstnameTH} ${user.lastnameTH} || สถานะ: ไม่รับส่งตัว || ดูรายละเอียด https://refer-aps2.vercel.app/en/login`
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
  return (
    <>
      <Card>
        <div className='flex  flex-col md:flex-row transition-all duration-300 ease-in-out px-6'>
          {/* Table Container */}
          <div className={`transition-all duration-300 ease-in-out ${sidePanelComponent ? 'w-6/12' : 'w-full'}`}>
            {session?.user?.role !== 'regist' ? (
              <TableContainer
                component={Paper}
                className={`transition-all duration-300 ease-in-out mt-12  overflow-y-auto max-h-[60vh] md:max-h-40vh]`} // Change width based on sidePanelComponent presence
              >
                <Table aria-label='collapsible table'>
                  <TableHead className='' style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                    <TableRow>
                      <TableCell />
                      <TableCell>Visited Date</TableCell>
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
                    ) : dataOpds?.length > 0 ? (
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
            ) : (
              ''
            )}
            <div className='flex flex-col sm:flex-row'>
              <div className={`transition-none p-2 ${sidePanelComponent ? 'w-6/12' : 'w-full sm:w-6/12'} my-2`}>
                <InputLabel
                  htmlFor='consultationNotes'
                  className={`text-sm font-medium ${refer === true ? 'text-gray-300' : 'text-gray-700'} `}
                >
                  Consultation Notes
                </InputLabel>
                <TextField
                  InputProps={{
                    readOnly: refer == 'true' ? false : true
                  }}
                  focused={referDetails.hospital_id === session?.user?.hospitalId && refer === 'true'}
                  id='consultationNotes'
                  name='consultationNotes'
                  defaultValue={consultationNotes} // Uncontrolled input
                  inputRef={consultationNotesRef} // Use ref to get the input value
                  onBlur={handleBlur} // Trigger state update only on blur
                  multiline
                  rows={5}
                  fullWidth
                />
                {referDetails.hospital_id === session?.user?.hospitalId && refer === 'true' && (
                  <div className='flex justify-end mt-4  mb-4'>
                    <Button
                      variant='contained'
                      onClick={() => {
                        handleNoteSubmit(referDetails.id)
                        // handleNoteSubmit(referDetails.id)
                      }}
                    >
                      บันทึก Notes
                    </Button>
                  </div>
                )}
              </div>
              <div className={`transition-none p-2 ${sidePanelComponent ? 'w-6/12' : 'w-full sm:w-6/12'} my-2`}>
                <InputLabel
                  htmlFor='consultationNotes'
                  className={`text-sm font-medium ${['admin', 'doctor'].includes(session?.user?.role) && refer == 'false' ? 'text-gray-700' : 'text-gray-300'}`}
                >
                  Reply - Consultation Notes
                </InputLabel>
                <TextField
                  color='primary'
                  focused={['admin', 'doctor'].includes(session?.user?.role) && refer == 'false'}
                  InputProps={{
                    readOnly: !['admin', 'doctor'].includes(session?.user?.role) || refer == 'true'
                  }}
                  id='doctorNotes'
                  name='doctorNotes'
                  defaultValue={doctorNotes} // Uncontrolled input
                  inputRef={doctorNotesRef} // Use ref to get the input value
                  onBlur={handleBlur} // Trigger state update only on blur
                  multiline
                  rows={5}
                  fullWidth
                />
                {(session?.user?.role === 'doctor' || session?.user?.role === 'admin') &&
                  refer === 'false' &&
                  (referDetails.status === '2' ? (
                    <div className='flex justify-end mt-4 gap-2'>
                      <Button variant='contained' onClick={()=> {handleReplyNoteSubmit(referDetails.id)}}>บันทึก</Button>

                      <Button
                        color='info'
                        variant='contained'
                        onClick={() => {
                          setIsSendback(true)
                          // handleNoteSubmit(referDetails.id)
                        }}
                      >
                        ส่งกลับ
                      </Button>
                    </div>
                  ) : (
                    <div className='flex justify-end mt-4 gap-2'>
                      <Button
                        variant='contained'
                        onClick={() => {
                          setIsRefer(true)
                          // handleNoteSubmit(referDetails.id)
                        }}
                      >
                        รับส่งตัว
                      </Button>
                      <Button
                        color='warning'
                        variant='contained'
                        onClick={() => {
                          setIsForward(true)
                          // handleNoteSubmit(referDetails.id)
                        }}
                      >
                        ส่งต่อ
                      </Button>
                      <Button
                        color='error'
                        variant='contained'
                        onClick={() => {
                          setIsCancel(true)
                          // handleNoteSubmit(referDetails.id)
                        }}
                      >
                        ไม่รับส่งตัว
                      </Button>

                      {/* {referDetails.status === '2' ? (
                      <>

                      </>
                    ) : (
                      ''
                    )} */}
                    </div>
                  ))}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row '>
              <div className={`transition-none p-2 ${sidePanelComponent ? 'w-full' : 'w-full sm:w-6/12'} `}>
                <InputLabel
                  htmlFor='nurseNotes'
                  className={`text-sm font-medium ${['admin', 'nurse'].includes(session?.user?.role) && refer == 'false' ? 'text-gray-700' : 'text-gray-300'}`}
                >
                  Nurse Notes
                </InputLabel>
                <CustomTextField
                  value={nurseNotes}
                  className='my-2'
                  onChange={e => {
                    setNurseNotes(e.target.value)
                  }}
                  fullWidth
                  select
                  size='large'
                  focused={['admin', 'nurse'].includes(session?.user?.role) && refer == 'false'}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 200, // Adjust this height as needed
                          overflow: 'auto'
                        }
                      }
                    }
                  }}
                  InputProps={{
                    readOnly: !['admin', 'nurse'].includes(session?.user?.role) || refer == 'true'
                  }}
                >
                  <MenuItem value={'รอตอบปรึกษา'}>รอตอบปรึกษา</MenuItem>
                  <MenuItem value={'ตอบปรึกษา และทำใบนัดแล้ว'}>ตอบปรึกษา และทำใบนัดแล้ว</MenuItem>
                  <MenuItem value={'ตอบปรึกษา และรับเป็น IPD แล้ว'}>ตอบปรึกษา และรับเป็น IPD แล้ว</MenuItem>
                  <MenuItem value={'ตอบปรึกษา ทำใบนัดและส่ง SMS'}>ตอบปรึกษา ทำใบนัดและส่ง SMS แล้ว</MenuItem>
                </CustomTextField>
                <Dialog open={dialogSMS} maxWidth='lg' fullWidth>
                  <DialogTitle>
                    <Typography variant='h5'>ส่ง SMS ไปยังผู้ป่วย</Typography>
                  </DialogTitle>
                  <Divider />
                  <DialogContent>
                    <div className='p-0'>
                      <span className='my-4 font-medium text-gray-700'>รายละเอียดใบนัดผู้ป่วย</span>
                      <Divider className='my-4' />
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <CustomTextField
                            disabled
                            fullWidth
                            label='ชื่อ-สกุล'
                            value={`${referDetails?.Customer?.firstnameTH || ''} ${referDetails?.Customer?.lastnameTH || ''}`}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <CustomTextField
                            disabled
                            fullWidth
                            label='อายุ'
                            value={formatAge((referDetails?.Customer?.birthDate).substring(0, 10)) || ''}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <CustomTextField
                            disabled
                            fullWidth
                            label='คลินิก'
                            value={dataOpd.length > 0 ? dataOpd[0].PV1_CLINIC_NAME : ''}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <CustomTextField
                            required
                            error={(!patientPhone && sendData) || (patientPhone && !isValidPhone)}
                            fullWidth
                            label='เบอร์โทรผู้ป่วย'
                            value={patientPhone}
                            onChange={handlePhoneNumberChange}
                            helperText={
                              !patientPhone && sendData
                                ? 'กรุณากรอกเบอร์โทรศัพท์'
                                : patientPhone && !isValidPhone
                                  ? 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ขึ้นต้นด้วย 0 และมี 9-10 หลัก)'
                                  : ''
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <AppReactDatepicker
                            minDate={new Date()} // Prevents selecting past dates
                            selected={dateTime}
                            required
                            id='date-time-picker'
                            dateFormat='yyyy-MM-dd'
                            onChange={date => {
                              setDateTime(date)
                              setDateError(!date) // Clear error when date is selected
                            }}
                            customInput={
                              <CustomTextField
                                label='เลือกวันที่นัดหมาย'
                                fullWidth
                                error={dateError && sendData}
                                helperText={dateError && sendData ? 'กรุณาเลือกวันที่นัดหมาย' : ''}
                              />
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <CustomTextField
                            select
                            required
                            fullWidth
                            label='เลือกเวลานัดหมาย'
                            value={time}
                            onChange={e => {
                              setTime(e.target.value)
                              setTimeError(!e.target.value) // Clear error when time is selected
                            }}
                            error={timeError && sendData}
                            helperText={timeError && sendData ? 'กรุณาเลือกเวลานัดหมาย' : ''}
                          >
                            <MenuItem value='08:00'>08:00</MenuItem>
                            <MenuItem value='08:30'>08:30</MenuItem>
                            <MenuItem value='09:00'>09:00</MenuItem>
                            <MenuItem value='09:30'>09:30</MenuItem>
                            <MenuItem value='10:00'>10:00</MenuItem>
                            <MenuItem value='10:30'>10:30</MenuItem>
                            <MenuItem value='11:00'>11:00</MenuItem>
                            <MenuItem value='11:30'>11:30</MenuItem>
                            <MenuItem value='12:00'>12:30</MenuItem>
                            <MenuItem value='12:30'>12:00</MenuItem>
                            <MenuItem value='13:00'>13:00</MenuItem>
                            <MenuItem value='13:30'>13:30</MenuItem>
                            <MenuItem value='14:00'>14:00</MenuItem>
                            <MenuItem value='14:30'>14:30</MenuItem>
                            <MenuItem value='15:00'>15:00</MenuItem>
                            <MenuItem value='15:30'>15:30</MenuItem>
                            <MenuItem value='16:00'>16:00</MenuItem>
                            <MenuItem value='16:30'>16:30</MenuItem>
                            <MenuItem value='17:00'>17:00</MenuItem>
                            <MenuItem value='17:30'>17:30</MenuItem>
                            <MenuItem value='18:00'>18:00</MenuItem>
                            <MenuItem value='18:30'>18:30</MenuItem>
                          </CustomTextField>
                        </Grid>
                        {/* <Grid item xs={12} sm={6} md={2}>
                          <div className='my-4'>
                            <Button variant='contained' onClick={handleAppointmentSave} color='primary'>
                              บันทึก
                            </Button>
                          </div>
                        </Grid> */}
                      </Grid>
                      <Divider className='my-4' />
                      <span className='my-4 font-medium text-gray-700'>ข้อความ</span>
                      <div className='flex items-center gap-4'>
                        <TextField
                          color='primary'
                          multiline
                          rows={5}
                          fullWidth
                          value={textSMS}
                          onChange={event => setTextSMS(event.target.value)}
                          helperText={`${textSMS.length} character(s)`}
                        />
                      </div>
                      <div className='my-4'>
                        <Button variant='contained' onClick={handleAppointmentSave} color='primary'>
                          บันทึก
                        </Button>
                        <Button className='mx-2' variant='outlined' onClick={ClearMessage} color='primary'>
                          ล้าง
                        </Button>
                      </div>
                      <Divider className='my-4' />
                      <span className='my-4 font-medium text-gray-700'>ตัวอย่างของการส่ง SMS</span>
                      <div className='flex items-center gap-4 '>
                        <TextField
                          color='primary'
                          id='form-props-read-only-input'
                          inputProps={{ readOnly: true }}
                          multiline
                          rows={3}
                          onChange={event => setMessageSMS(event.target.value)}
                          fullWidth
                          value={messageSMS}
                        />
                      </div>
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={() => {
                        SendSMS(nurseNotes)
                      }}
                    >
                      ยืนยันการส่ง
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={CloseDialogSMS}>
                      ปิด
                    </Button>
                  </DialogActions>
                </Dialog>
                {(session?.user?.role === 'admin' || session?.user?.role === 'nurse') && refer === 'false' && (
                  <div className='flex justify-end mt-4'>
                    <Button
                      variant='contained'
                      onClick={() => {
                        handleNurseNotesSubmit(referDetails.id, nurseNotes)
                        // handleNoteSubmit(referDetails.id)
                        if (nurseNotes === 'ตอบปรึกษา ทำใบนัดและส่ง SMS') {
                          toast.warning('ฟังชั่นส่ง SMS ยังไม่เปิดให้บริการโปรดติดต่อเจ้าหน้าที่', {
                            position: 'top-right',
                            autoClose: 5000, // 5 seconds
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false
                          })
                          // if(referDetails?.status_sms === "2"){
                          //   toast.warning('ไม่สามารถส่ง SMS ซ้ำได้!', {
                          //     position: 'top-right',
                          //     autoClose: 5000, // 5 seconds
                          //     hideProgressBar: false,
                          //     closeOnClick: true,
                          //     pauseOnHover: false
                          //   })
                          // } else {
                          //   setDialogSMS(true)
                          // }
                        }
                      }}
                    >
                      {nurseNotes === 'ตอบปรึกษา ทำใบนัดและส่ง SMS' ? 'บันทึก Notes & ส่ง SMS' : 'บันทึก Notes'}
                    </Button>
                  </div>
                )}
              </div>
              <div className={`transition-none p-2 ${sidePanelComponent ? 'w-full' : 'w-full sm:w-6/12'}`}>
                <InputLabel
                  htmlFor='registNotes'
                  className={`text-sm font-medium ${['admin', 'regist'].includes(session?.user?.role) && refer == 'false' ? 'text-gray-700' : 'text-gray-300'}`}
                >
                  ห้องบัตร
                </InputLabel>
                <CustomTextField
                  value={registNotes}
                  className='my-2'
                  onChange={e => setRegisNotes(e.target.value)}
                  fullWidth
                  select
                  size='large'
                  focused={['admin', 'regist'].includes(session?.user?.role) && refer == 'false'}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 200, // Adjust this height as needed
                          overflow: 'auto'
                        }
                      }
                    }
                  }}
                  InputProps={{
                    readOnly: !['admin', 'regist'].includes(session?.user?.role) || refer == 'true'
                  }}
                >
                  <MenuItem value={'รอทำบัตร'}>รอทำบัตร</MenuItem>
                  <MenuItem value={'ทำบัตร และส่งตรวจแล้ว'}>ทำบัตร และส่งตรวจแล้ว</MenuItem>
                </CustomTextField>
                {(session?.user?.role === 'admin' || session?.user?.role === 'regist') && refer === 'false' && (
                  <div className='flex justify-end mt-4  mb-4'>
                    <Button
                      variant='contained'
                      onClick={() => {
                        handleRegistNotesSubmit(referDetails.id, registNotes)
                        // handleNoteSubmit(referDetails.id)
                      }}
                    >
                      บันทึก Notes
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {/* <div className={`flex justify-end mb-4 mr-2`}>
              <Button variant='contained' onClick={() => handleNoteSubmit(referDetails.id)}>
                บันทึก Notes
              </Button>
            </div> */}
            {/* <div className='flex flex-col'>
              <TextField
                disabled={loading}
                label='Doctor Notes'
                className={`transition-none ${sidePanelComponent ? 'w-full' : 'w-6/12'} my-4`}
                name='doctorNotes'
                defaultValue={doctorNotes} // Uncontrolled input
                inputRef={doctorNotesRef} // Use ref to get the input value
                onBlur={handleBlur} // Trigger state update only on blur
                multiline
                rows={5}
              />
              <div className={`${sidePanelComponent ? 'w-full' : 'w-6/12'} flex justify-end mb-2`}>
                <Button variant='contained' onClick={() => noteSubmit(referDetails.id)}>
                  บันทึก Notes
                </Button>
              </div>
            </div> */}
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
        fullWidth={true} // Boolean value
        maxWidth='md' // 'md' size for width
        open={isRefer}
        aria-labelledby='form-dialog-title'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleClose()
          }
        }}
      >
        {/* #######Accept Refer Modal####### */}
        <DialogTitle id='form-dialog-title' className='bg-primary'>
          <div className='flex items-center space-x-2'>
            <Typography variant='h-5' className='text-white'>
              ยืนยันการรับปรึกษา
            </Typography>
          </div>
        </DialogTitle>

        <DialogContent>
          <FormControl fullWidth error={hospitalError}>
            <Typography className='mb-1 mt-4'>เลือกโรงพยาบาลปลายทาง</Typography>
            <Select
              size='small'
              fullWidth
              disabled
              value={destinationHospital}
              onChange={event => handleDesinationHospitalChange(event.target.value)} // Set the state to the selected value
            >
              {hospitalList.map(hospital => (
                <MenuItem key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </MenuItem>
              ))}
            </Select>
            {hospitalError && <FormHelperText>กรุณาเลือกโรงพยาบาลปลายทาง</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={departmentError} className='mt-2'>
            <Typography className='mb-1'>เลือกหน่วยงาน/แผนก</Typography>
            <Select
              size='small'
              fullWidth
              value={destinationDepartments}
              onChange={event => handleDesinationDepartmentChange(event.target.value)} // Set the state to the selected value
            >
              {departmentList.map(department => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
            {departmentError && <FormHelperText>กรุณาเลือกหน่วยงาน/แผนก</FormHelperText>}
          </FormControl>
          <FormControl fullWidth className='mt-2'>
            <Typography className='mb-1'>ประเภทบริการ</Typography>
            <Select
              size='small'
              fullWidth
              value={serviceType}
              onChange={event => setServiceType(event.target.value)} // Update service type state
            >
              <MenuItem value='OPD'>OPD</MenuItem>
              <MenuItem value='IPD'>IPD</MenuItem>
            </Select>
          </FormControl>
          {serviceType === 'IPD' && (
            <FormControl fullWidth error={departmentError} className='mt-2'>
              <Typography className='mb-1'>ความเร่งด่วน</Typography>
              <Select
                size='small'
                fullWidth
                value={urgency}
                onChange={event => setUrgency(event.target.value)} // Set the state to the selected value
              >
                <MenuItem className='text-warning' value={'1'}>
                  Urgency
                </MenuItem>
                <MenuItem className='text-error' value={'2'}>
                  Emergency
                </MenuItem>
              </Select>
              {departmentError && <FormHelperText>กรุณาเลือกหน่วยงาน/แผนก</FormHelperText>}
            </FormControl>
          )}
        </DialogContent>

        <DialogActions className='dialog-actions-dense'>
          <Button
            onClick={() => handleReferSubmit(referDetails.id, '2', referDetails.Customer, referDetails.Hospital.id)}
            variant='contained'
            className='mt-3'
          >
            ยืนยัน
          </Button>
          <Button onClick={handleClose} variant='outlined' color='secondary' className='mt-3'>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
      {/* #######cancel modal####### */}
      <Dialog
        fullWidth
        maxWidth='md'
        open={isCancel}
        aria-labelledby='form-dialog-title'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='form-dialog-title' className='bg-error'>
          <div className='flex items-center space-x-2'>
            <Typography variant='h-5' className='text-white'>
              ไม่รับส่งตัว
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className='p-4 '>
            <Typography className='mb-2 text-lg font-semibold'>
              คุณต้องการยืนยันที่จะ
              <span className='text-red-500'> ไม่รับส่งตัวพร้อมให้คำแนะนำ </span>
            </Typography>
            <Typography variant='h6' className='mt-4 mb-2 text-indigo-600'>
              รายละเอียด
            </Typography>

            <div className='p-4 border-l-4 border-red-500 bg-white shadow-md rounded-md space-y-1'>
              <Typography className='text-base font-medium text-gray-700'>
                ชื่อ-สกุล:{' '}
                <span className='text-red-500'>
                  {referDetails.Customer.firstnameTH} {referDetails.Customer.lastnameTH}
                </span>
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>
                โรงพยาบาลต้นทาง: <span className='text-red-500'>{referDetails.Hospital.name}</span>
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>Doctor Notes:</Typography>
              <TextField
                value={doctorNotes}
                focused={false}
                InputProps={{
                  readOnly: true
                }}
                multiline
                rows={5}
                fullWidth
                readOnly
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions className='dialog-actions-dense'>
          <Button
            onClick={() => handleReferCancel(referDetails.id, referDetails.Customer)}
            variant='contained'
            className='bg-primary-600 text-white hover:bg-primary-700 transition mt-3'
          >
            ยืนยัน
          </Button>
          <Button onClick={handleClose} variant='outlined' color='secondary' className='mt-3'>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth='md'
        open={isForward}
        aria-labelledby='form-dialog-title'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='form-dialog-title' className='bg-warning'>
          <div className='flex items-center space-x-2'>
            <Typography variant='h-5' className='text-white'>
              ส่งต่อคนไข้
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className='p-4 '>
            <Typography className='mb-2 text-lg font-semibold'>
              คุณต้องการยืนยันที่จะ
              <span className='text-amber-500'> ส่งต่อ </span>
              คนไข้
            </Typography>
            <Typography variant='h6' className='mt-4 mb-2 text-indigo-600'>
              รายละเอียด
            </Typography>

            <div className='p-4 border-l-4 border-amber-500 bg-white shadow-md rounded-md space-y-1'>
              <Typography className='text-base font-medium text-gray-700'>
                ชื่อ-สกุล:{' '}
                <span className='text-amber-500'>
                  {referDetails.Customer.firstnameTH} {referDetails.Customer.lastnameTH}
                </span>
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>
                โรงพยาบาลต้นทาง: <span className='text-amber-500'>{referDetails.Hospital.name}</span>
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>Doctor Notes:</Typography>
              <TextField
                value={doctorNotes}
                focused={false}
                InputProps={{
                  readOnly: true
                }}
                multiline
                rows={5}
                fullWidth
                readOnly
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions className='dialog-actions-dense'>
          <Button
            onClick={() => handleForwardSubmit(referDetails.id, referDetails.Customer)}
            variant='contained'
            className='bg-primary-600 text-white hover:bg-primary-700 transition mt-3'
          >
            ยืนยัน
          </Button>
          <Button onClick={handleClose} variant='outlined' color='secondary' className='mt-3'>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth='md'
        open={isSendback}
        aria-labelledby='form-dialog-title'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='form-dialog-title' className='bg-info'>
          <div className='flex items-center space-x-2'>
            <Typography variant='h-5' className='text-white'>
              ส่งข้อมูลเพิ่มเติม
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className='p-4 '>
            <Typography className='mb-2 text-lg font-semibold'>
              คุณต้องการยืนยันที่จะ
              <span className='text-cyan-500'> ส่งข้อมูลเพิ่มเติม </span>
            </Typography>
            <Typography variant='h6' className='mt-4 mb-2 text-indigo-600'>
              รายละเอียด
            </Typography>

            <div className='p-4 border-l-4 border-cyan-500 bg-white shadow-md rounded-md space-y-1'>
              <Typography className='text-base font-medium text-gray-700'>
                ชื่อ-สกุล:{' '}
                <span className='text-cyan-500'>
                  {referDetails.Customer.firstnameTH} {referDetails.Customer.lastnameTH}
                </span>
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>
                โรงพยาบาลต้นทาง: <span className='text-cyan-500'>{referDetails.Hospital.name}</span>
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>Doctor Notes:</Typography>
              <TextField
                value={doctorNotes}
                focused={false}
                InputProps={{
                  readOnly: true
                }}
                multiline
                rows={5}
                fullWidth
                readOnly
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions className='dialog-actions-dense'>
          <Button
            onClick={() => handleSendbackSubmit(referDetails.id, referDetails.Customer)}
            variant='contained'
            className='bg-primary-600 text-white hover:bg-primary-700 transition mt-3'
          >
            ยืนยัน
          </Button>
          <Button onClick={handleClose} variant='outlined' color='secondary' className='mt-3'>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OpdTable
