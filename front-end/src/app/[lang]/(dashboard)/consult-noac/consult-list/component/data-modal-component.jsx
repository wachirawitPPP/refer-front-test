import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
  InputLabel
} from '@mui/material'
import Procedure from '../component/procedure'
import MedicationStatement from '../component/medication-statement'
import Observation from '../component/observation'
import DiagnosticList from '../component/diagnostic-list'
import VitalSigns from '../component/vital-signs'
import FileScan from '../component/file-scan'
import EOpdCard from '../component/e-opd-card'

import DataNotFound from '@/views/DataNotFound'
import PropTypes from 'prop-types'
const getEphisOPD = async (id_card, token) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/apiEphis/login`, {
      headers: {
        Authorization: `${token}`
      }
    })

    const token2 = response.data.data.token
    const response1 = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/OPD_erfer`, {
      headers: {
        Authorization: `${token2}`
      },
      params: {
        idcard: id_card
      }
    })
    return response1.data
  } catch (error) {
    console.error('Error fetching data:', error)
    return [] // Return an empty array if there's an error
  }
}

const Row = props => {
  const { ephisOPD, onToggle, isExpanded } = props

  const [showTable, setShowTable] = useState(null)

  useEffect(() => {
    if (isExpanded === false) {
      setShowTable(false)
    }
  }, [isExpanded])

  const handleExpandClicked = state => {
    if (isExpanded === true && state === 'button') {
    } else {
      onToggle()
    }
  }

  const checkNullData = data => {
    if (data.length === 0) return true
    else return false
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
        <TableCell>
          {isExpanded && (
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => {
                if (isExpanded) {
                  onToggle()
                }
              }}
            >
              <i
                className={`tabler-x -rotate-90
                  text-[22px] items-center ${
                    isExpanded ? 'rotate-0 text-error' : ''
                  } transition-transform duration-300`}
              />
            </IconButton>
          )}
        </TableCell>
        <TableCell className='whitespace-nowrap'>{formatDateTime(ephisOPD?.PV1_ADMIT_DATE_TIME) || ''}</TableCell>
        <TableCell className='whitespace-nowrap'>{ephisOPD?.PV1_CLINIC_NAME || ''}</TableCell>
        <TableCell className='whitespace-nowrap'>
          {ephisOPD?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || '-'}
        </TableCell>
        <TableCell className='w-60 space-x-1  whitespace-nowrap '>
          <Tooltip
            title='Vitals Sign'
            arrow // Optional: adds an arrow to the tooltip
            // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  setShowTable(<VitalSigns data={ephisOPD} />)
                  handleExpandClicked('button')
                }}
                disabled={checkNullData(ephisOPD)}
                className='bg-indigo-500 w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-user-search w-5 h-5 ${checkNullData(ephisOPD) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
          <Tooltip
            title='Diagnostic'
            arrow // Optional: adds an arrow to the tooltip
            disableHoverListener={checkNullData(ephisOPD?.Diag)} // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  setShowTable(<DiagnosticList data={ephisOPD?.Diag} />)
                  handleExpandClicked('button')
                }}
                disabled={checkNullData(ephisOPD?.Diag)}
                style={{
                  backgroundColor: checkNullData(ephisOPD?.Diag) ? '#e3e5e0' : '#009B77' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-file-search w-5 h-5 ${checkNullData(ephisOPD?.Diag) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
          <Tooltip
            title='Procedure'
            arrow // Optional: adds an arrow to the tooltip
            disableHoverListener={checkNullData(ephisOPD?.Procedure)} // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  handleExpandClicked('button')
                  setShowTable(<Procedure data={ephisOPD?.Procedure} />)
                }}
                disabled={checkNullData(ephisOPD?.Procedure)}
                style={{
                  backgroundColor: checkNullData(ephisOPD?.Procedure) ? '#e3e5e0' : '#36C2CE' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-stethoscope w-5 h-5 ${checkNullData(ephisOPD?.Procedure) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
          <Tooltip
            title='Medication'
            arrow // Optional: adds an arrow to the tooltip
            disableHoverListener={checkNullData(ephisOPD?.Medicine)} // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  handleExpandClicked('button')
                  setShowTable(<MedicationStatement data={ephisOPD?.Medicine} />)
                }}
                disabled={checkNullData(ephisOPD?.Medicine)}
                style={{
                  backgroundColor: checkNullData(ephisOPD?.Medicine) ? '#e3e5e0' : '#B565A7' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-pill w-5 h-5 ${checkNullData(ephisOPD?.Medicine) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
          <Tooltip
            title='Lab'
            arrow // Optional: adds an arrow to the tooltip
            disableHoverListener={checkNullData(ephisOPD?.Lab)} // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  handleExpandClicked('button')
                  setShowTable(<Observation data={ephisOPD?.Lab} />)
                }}
                disabled={checkNullData(ephisOPD?.Lab)}
                style={{
                  backgroundColor: checkNullData(ephisOPD?.Lab) ? '#e3e5e0' : '#88B04B' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-microscope w-5 h-5 ${checkNullData(ephisOPD?.Lab) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
          <Tooltip
            title='File Scan'
            arrow // Optional: adds an arrow to the tooltip
            disableHoverListener={checkNullData(ephisOPD?.Lab)} // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  handleExpandClicked('button')
                  setShowTable(<FileScan data={ephisOPD?.Lab} />)
                }}
                disabled={checkNullData(ephisOPD?.Lab)}
                style={{
                  backgroundColor: checkNullData(ephisOPD?.Lab) ? '#e3e5e0' : '#FF0000' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-letter-s w-5 h-5 ${checkNullData(ephisOPD?.Lab) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
          <Tooltip
            title='E-OPD'
            arrow // Optional: adds an arrow to the tooltip
            disableHoverListener={checkNullData(ephisOPD?.Lab)} // Disable tooltip hover when button is disabled
          >
            <span>
              <button
                onClick={() => {
                  handleExpandClicked('button')
                  setShowTable(<EOpdCard data={ephisOPD?.Lab} />)
                }}
                disabled={checkNullData(ephisOPD?.Lab)}
                style={{
                  backgroundColor: checkNullData(ephisOPD?.Lab) ? '#e3e5e0' : '#FFA24C' // No color when disabled, custom color when enabled
                }}
                className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
              >
                <i
                  className={`tabler tabler-letter-e w-5 h-5 ${checkNullData(ephisOPD?.Lab) ? 'text-gray-400' : 'text-white'}`}
                ></i>
              </button>
            </span>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={isExpanded} timeout='auto' unmountOnExit>
            <div className='w-full m-4'>
              {showTable ?? <Typography className='flex justify-center'>โปรดเลือกข้อมูลที่เมนูด้านขวา</Typography>}
            </div>
            {/* <div className='flex justify-end p-2 space-x-2'>
                <Tooltip
                  title='Diagnostic'
                  arrow // Optional: adds an arrow to the tooltip
                  disableHoverListener={checkNullData(ephisOPD?.Diag)} // Disable tooltip hover when button is disabled
                >
                  <span>
                    <button
                      onClick={() => setShowTable(<DiagnosticList data={ephisOPD?.Diag} />)}
                      disabled={checkNullData(ephisOPD?.Diag)}
                      style={{
                        backgroundColor: checkNullData(ephisOPD?.Diag) ? '#e3e5e0' : '#009B77' // No color when disabled, custom color when enabled
                      }}
                      className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
                    >
                      <i
                        className={`tabler tabler-file-search w-5 h-5 ${checkNullData(ephisOPD?.Diag) ? 'text-gray-400' : 'text-white'}`}
                      ></i>
                    </button>
                  </span>
                </Tooltip>
                <Tooltip
                  title='Procedure'
                  arrow // Optional: adds an arrow to the tooltip
                  disableHoverListener={checkNullData(ephisOPD?.Procedure)} // Disable tooltip hover when button is disabled
                >
                  <span>
                    <button
                      // onClick={() => {
                      //   setSidePanelComponent(
                      //     <div>
                      //       <Typography variant='h5' className=''>
                      //         {dataOpds?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || ''}-{dataOpds?.PV1_CLINIC_NAME}-
                      //         {formatDateTime(dataOpds?.PV1_ADMIT_DATE_TIME)}
                      //       </Typography>
                      //       <Procedure data={dataOpds?.Procedure} />
                      //     </div>
                      //   )
                      // }}
                      disabled={checkNullData(ephisOPD?.Procedure)}
                      style={{
                        backgroundColor: checkNullData(ephisOPD?.Procedure) ? '#e3e5e0' : '#36C2CE' // No color when disabled, custom color when enabled
                      }}
                      className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
                    >
                      <i
                        className={`tabler tabler-stethoscope w-5 h-5 ${checkNullData(ephisOPD?.Procedure) ? 'text-gray-400' : 'text-white'}`}
                      ></i>
                    </button>
                  </span>
                </Tooltip>
                <Tooltip
                  title='Medication'
                  arrow // Optional: adds an arrow to the tooltip
                  disableHoverListener={checkNullData(ephisOPD?.Medicine)} // Disable tooltip hover when button is disabled
                >
                  <span>
                    <button
                      // onClick={() => {
                      //   setSidePanelComponent(
                      //     <div>
                      //       <Typography variant='h5' className=''>
                      //         {dataOpds?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || ''}-{dataOpds?.PV1_CLINIC_NAME}-
                      //         {formatDateTime(dataOpds?.PV1_ADMIT_DATE_TIME)}
                      //       </Typography>
                      //       <MedicationStatement data={dataOpds?.Medicine} />
                      //     </div>
                      //   )
                      // }}
                      disabled={checkNullData(ephisOPD?.Medicine)}
                      style={{
                        backgroundColor: checkNullData(ephisOPD?.Medicine) ? '#e3e5e0' : '#B565A7' // No color when disabled, custom color when enabled
                      }}
                      className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
                    >
                      <i
                        className={`tabler tabler-pill w-5 h-5 ${checkNullData(ephisOPD?.Medicine) ? 'text-gray-400' : 'text-white'}`}
                      ></i>
                    </button>
                  </span>
                </Tooltip>
                <Tooltip
                  title='Lab'
                  arrow // Optional: adds an arrow to the tooltip
                  disableHoverListener={checkNullData(ephisOPD?.Lab)} // Disable tooltip hover when button is disabled
                >
                  <span>
                    <button
                      // onClick={() => {
                      //   setLabDialog(true)
                      // }}
                      disabled={checkNullData(ephisOPD?.Lab)}
                      style={{
                        backgroundColor: checkNullData(ephisOPD?.Lab) ? '#e3e5e0' : '#88B04B' // No color when disabled, custom color when enabled
                      }}
                      className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
                    >
                      <i
                        className={`tabler tabler-microscope w-5 h-5 ${checkNullData(ephisOPD?.Lab) ? 'text-gray-400' : 'text-white'}`}
                      ></i>
                    </button>
                  </span>
                </Tooltip>
                <Tooltip
                  title='File Scan'
                  arrow // Optional: adds an arrow to the tooltip
                  disableHoverListener={checkNullData(ephisOPD?.Lab)} // Disable tooltip hover when button is disabled
                >
                  <span>
                    <button
                      // onClick={() => {
                      //   setSidePanelComponent(
                      //     <div>
                      //       <Typography variant='h5' className=''>
                      //         {dataOpds?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || ''}-{dataOpds?.PV1_CLINIC_NAME}-
                      //         {formatDateTime(dataOpds?.PV1_ADMIT_DATE_TIME)}
                      //       </Typography>
                      //       <FileScan data={dataOpds?.Lab} />
                      //     </div>
                      //   )
                      // }}
                      disabled={checkNullData(ephisOPD?.Lab)}
                      style={{
                        backgroundColor: checkNullData(ephisOPD?.Lab) ? '#e3e5e0' : '#FF0000' // No color when disabled, custom color when enabled
                      }}
                      className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
                    >
                      <i
                        className={`tabler tabler-letter-s w-5 h-5 ${checkNullData(ephisOPD?.Lab) ? 'text-gray-400' : 'text-white'}`}
                      ></i>
                    </button>
                  </span>
                </Tooltip>
                <Tooltip
                  title='E-OPD'
                  arrow // Optional: adds an arrow to the tooltip
                  disableHoverListener={checkNullData(ephisOPD?.Lab)} // Disable tooltip hover when button is disabled
                >
                  <span>
                    <button
                      // onClick={() => {
                      //   setSidePanelComponent(
                      //     <div>
                      //       <Typography variant='h5' className=''>
                      //         {dataOpds?.PV1_PATIENT_CLASS === 'O' ? 'OPD' : 'IPD' || ''}-{dataOpds?.PV1_CLINIC_NAME}-
                      //         {formatDateTime(dataOpds?.PV1_ADMIT_DATE_TIME)}
                      //       </Typography>
                      //       <EOpdCard data={dataOpds?.Lab} />
                      //     </div>
                      //   )
                      // }}
                      disabled={checkNullData(ephisOPD?.Lab)}
                      style={{
                        backgroundColor: checkNullData(ephisOPD?.Lab) ? '#e3e5e0' : '#FFA24C' // No color when disabled, custom color when enabled
                      }}
                      className='w-10 h-10 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed'
                    >
                      <i
                        className={`tabler tabler-letter-e w-5 h-5 ${checkNullData(ephisOPD?.Lab) ? 'text-gray-400' : 'text-white'}`}
                      ></i>
                    </button>
                  </span>
                </Tooltip>
              </div> */}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

const DataModaleComponent = ({ selectedUser }) => {
  const { data: session, status } = useSession()
  const [ephisOPD, setEphisOPD] = useState([])
  const [loading, setLoading] = useState(true) // Add loading state
  const [expandedRowIndex, setExpandedRowIndex] = React.useState(null)

  const handleRowToggle = index => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index) // Toggle the row
  }

  useEffect(() => {
    if (session?.user?.token && selectedUser.id_card) {
      setLoading(true) // Set loading to true before data fetch
      getEphisOPD(selectedUser.id_card, session.user.token)
        .then(res => {
          setEphisOPD(res)
        })
        .finally(() => setLoading(false)) // Set loading to false once data is loaded
    }
  }, [session?.user?.token, selectedUser.id_card])

  const fields = [
    { label: 'วว/ดด/ปปปป', value: 'PV1_ADMIT_DATE_TIME' },
    { label: 'ชื่อแผนก / หน่วยงาน', value: 'PV1_CLINIC_NAME' },
    { label: 'TYPE', value: 'PV1_PATIENT_CLASS' }
  ]

  return (
    <Grid item xs={12} md={12}>
      {loading ? (
        <Box display='flex' justifyContent='center' alignItems='center' height='65vh'>
          <CircularProgress /> {/* Show loading spinner when loading */}
        </Box>
      ) : (
        <TableContainer component={Paper} className='overflow-y-auto max-h-[65vh]'>
          <Table stickyHeader className='z-50' aria-label='observations table'>
            <TableHead>
              <TableRow>
                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1300, backgroundColor: 'white' }} />
                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1300, backgroundColor: 'white' }}>
                  Admit Date
                </TableCell>
                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1300, backgroundColor: 'white' }}>
                  Department
                </TableCell>
                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1300, backgroundColor: 'white' }}>Type</TableCell>
                <TableCell sx={{ position: 'sticky', top: 0, zIndex: 1300, backgroundColor: 'white' }}>
                  Category
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ephisOPD.length > 0 ? (
                ephisOPD.map((row, index) => (
                  <Row
                    key={index}
                    ephisOPD={row}
                    isExpanded={expandedRowIndex === index} // Only expand the currently selected row
                    onToggle={() => handleRowToggle(index)}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Grid>
  )
}

export default DataModaleComponent
