'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'

// Next Imports
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

// MUI Imports
import {
  Card,
  Button,
  Chip,
  IconButton,
  TablePagination,
  MenuItem,
  useMediaQuery,
  useTheme,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material'

// Third-party Imports
import classnames from 'classnames'
// import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports

import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import ViewOpdComponent from './opd-view-component'

// Filter Function
// const fuzzyFilter = (row, columnId, value, addMeta) => {
//   const itemRank = rankItem(row.getValue(columnId), value)
//   addMeta({ itemRank })
//   return itemRank.passed
// }

// Debounced Input Component
// const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
//   const [value, setValue] = useState(initialValue)

//   useEffect(() => {
//     setValue(initialValue)
//   }, [initialValue])

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange(value)
//     }, debounce)

//     return () => clearTimeout(timeout)
//   }, [value])

//   return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
// }

const columnHelper = createColumnHelper()

const userStatusObj = {
  active: 'success',
  inactive: 'secondary'
}

const Columns = ({ columnHelper, locale, forEditModal, forViewModal }) =>
  useMemo(
    () => [
      {
        header: '#',
        accessor: 'rowCount',
        cell: ({ row }) => <div>{row.index + 1}</div>
      },
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <Checkbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler()
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       {...{
      //         checked: row.getIsSelected(),
      //         disabled: !row.getCanSelect(),
      //         indeterminate: row.getIsSomeSelected(),
      //         onChange: row.getToggleSelectedHandler()
      //       }}
      //     />
      //   )
      // },
      columnHelper.accessor('id', {
        header: 'รหัส',
        cell: ({ row }) => row.original.opds.opd_code
      }),
      {
        header: 'แผนก/หน่วยงาน',
        cell: ({ row }) => row.original.name
      },
      {
        header: 'แพทย์ผู้ทำรายการ',
        cell: ({ row }) => row.original.opds?.opd_docName
      },
      {
        header: 'ประเภท',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              color={row.original.pattient_type == 'OPD' ? 'info' : 'warning'}
              variant='tonal'
              className='capitalize'
              label={row.original.pattient_type == 'OPD' ? 'OPD' : 'IPD'}
              size='small'
            />
          </div>
        )
      },
      {
        header: 'สร้างเมื่อ',
        cell: ({ row }) => {
          const date = new Date(row.original.opds?.createdAt)
          const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`

          return <div className='flex items-center gap-4'>{formattedDate}</div>
        }
      },
      {
        header: 'สถานะ',
        cell: ({ row }) => (
          // <Chip
          //   variant='tonal'
          //   className='capitalize'
          //   label={row.original.status}
          //   color={userStatusObj[row.original.status]}
          //   size='small'
          // />
          <div className='flex items-center gap-3'>
            <Chip
              color={row.original.opds?.isActive ? 'success' : 'error'}
              variant='tonal'
              className='capitalize'
              label={row.original.opds?.isActive ? 'ปกติ' : 'ระงับ'}
              size='small'
            />
          </div>
        )
      },

      {
        // header: 'ตัวเลือก',
        id: 'Action',
        header: () => <div style={{ width: '100%', textAlign: 'center' }}>ตัวเลือก</div>,
        cell: ({ row }) => (
          <div style={{ width: '100%', textAlign: 'center' }}>
            {/* <Tooltip title='ดูข้อมูล'>
              <IconButton onClick={() => forViewModal(row.original)}>
                <i data-bs-toggle='modal' className='tabler-eye text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip> */}
            <Tooltip title='แก้ไขข้อมูล'>
              <IconButton onClick={() => forEditModal(row.original.opds)}>
                <i data-bs-toggle='modal' className='tabler-edit text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>
          </div>
        ),
        enableSorting: false
      }
    ],
    [columnHelper, locale]
  )

const ReferOpdLists = ({ tableData, referDetail, hospitalList, refreshData }) => {
  const { data: session } = useSession()
  const router = useRouter()

  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(tableData)
  const [globalFilter, setGlobalFilter] = useState('')
  const [status, setStatus] = useState('')
  const [department, setDepartment] = useState('')
  const [docName, setDocName] = useState('')

  const [isModalOpen, setModalOpen] = useState(false)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [isRefer, setIsRefer] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const [isCancel, setIsCancel] = useState(false)
  const [dataEditOpds, setDataEditOpds] = useState(null)

  const [hospitalError, setHospitalError] = useState(false)
  const [departmentError, setDepartmentError] = useState(false)

  const [destinationHospital, setDestinationHospital] = useState(2)
  const [departmentList, setDepartmentList] = useState([])
  const [destinationDepartments, setDestinationDepartments] = useState(0)

  useEffect(() => {
    if (destinationHospital) {
      const selectedHospital = hospitalList.find(hospital => hospital.id === destinationHospital)
      setDepartmentList(selectedHospital?.departments || [])
    }
  }, [destinationHospital, hospitalList])

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (status && user.status !== status) return false
      if (department && user.department !== department) return false
      if (docName && user.createBy !== docName) return false
      return true
    })

    setData(filteredData)
  }, [status, tableData, setData, department, docName])

  const { lang: locale } = useParams()

  const forAddModal = () => {
    setModalTitle('เพิ่มการซักประวัติ')
    setModalOpen(true)
    setIsViewOnly(false)
    setIsCreate(true)
  }
  const forEditModal = data => {
    setDataEditOpds(data)
    setModalTitle(data.opd_code)
    setModalOpen(true)
    setIsViewOnly(false)
    setIsCreate(false)
  }

  const forViewModal = data => {
    setModalTitle('รายละเอียด ID : ' + data.id)
    setDataEditOpds(data)
    setModalOpen(true)
    setIsViewOnly(true)
  }

  const handleDesinationHospitalChange = value => {
    setDestinationHospital(value)
    if (value !== 0) setHospitalError(false) // Clear error when valid selection is made
  }

  const handleDesinationDepartmentChange = value => {
    setDestinationDepartments(value)
    if (value !== 0) setDepartmentError(false) // Clear error when valid selection is made
  }

  const handleReferSubmit = async id => {
    // Validation logic
    if (destinationHospital === 0) {
      setHospitalError(true) // Set error if no hospital is selected
      return
    }

    if (destinationDepartments === 0) {
      setDepartmentError(true) // Set error if no department is selected
      return
    }

    const selectedHospital = hospitalList.find(hospital => hospital.id === destinationHospital)
    const selectedDepartment = departmentList.find(department => department.id === destinationDepartments)

    const token = session.user.token
    const data = {
      id: id,
      dest_hospital_id: selectedHospital.id,
      destinationHospital: selectedHospital.name,
      dest_department_id: selectedDepartment.id,
      status: '2' // อัพเดตสถานะเป็นรับเข้ารักษา
    }
    console.log(data)

    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${id}`, data, {
        headers: {
          Authorization: `${token}`
        }
      })
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
  const handleReferSuccess = async id => {
    const token = session.user.token
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${id}`,
        {
          status: '3' // อัพเดตสถานะเป็นเสร็จสิ้น
        },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      setIsSuccess(false)
      toast.success('บันทึกข้อมูลสำเร็จ!', {
        position: 'top-right',
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false
      })
      router.push('/pages/refer')
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
  const handleClose = () => {
    setIsRefer(false)
    setIsSuccess(false)
    setIsCancel(false)
  }
  const columns = Columns({ columnHelper, locale, forEditModal, forViewModal })

  const table = useReactTable({
    data,
    columns,
    // filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    // globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })
  return (
    <>
      <Card>
        <div className='flex justify-end flex-col items-start w-full md:flex-row md:items-center p-6 border-bs gap-4'>
          <div className='flex flex-col sm:flex-row is-full md:is-auto items-start sm:items-center gap-4'>
            <CustomTextField
              select
              className='w-full sm:w-auto'
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>
            <CustomTextField
              select
              className='w-full sm:w-auto'
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
            <CustomTextField
              select
              className='w-full sm:w-auto'
              id='select-status'
              value={docName}
              onChange={e => setDocName(e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value=''>เลือกแพทย์ผู้ทำรายการ</MenuItem>
              <MenuItem value='นายแพทย์ A'>นายแพทย์ A</MenuItem>
              <MenuItem value='นายแพทย์ B'>นายแพทย์ B</MenuItem>
              <MenuItem value='นายแพทย์ C'>นายแพทย์ C</MenuItem>
            </CustomTextField>

            <CustomTextField
              select
              className='w-full sm:w-auto'
              id='select-status'
              value={status}
              onChange={e => setStatus(e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value=''>เลือกสถานะ</MenuItem>
              <MenuItem value='active'>ปกติ</MenuItem>
              <MenuItem value='inactive'>ระงับ</MenuItem>
            </CustomTextField>

            {/* <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='ค้นหารหัส'
              className='is-full sm:is-auto'
            /> */}
            {/* {referDetail.status == "2" && session.user.hostpitalId !== referDetail.hospital_id ? ( <Button
                variant='contained'
                size='medium'
                color='success'
                className='is-full sm:is-auto'
              >{' '}
              {isMdUp && <i className='tabler-check text-[22px] text-white mr-3' />} เสร็จสิ้น {' '}
            </Button>):( */}

            {referDetail.hospital_id != session.user.hospitalId ? (
              <Button
                variant='contained'
                size='medium'
                color={referDetail.status == '2' ? 'success' : 'warning'}
                className='w-full sm:w-3/12'
                onClick={() => {
                  if (referDetail.status == '1') {
                    setIsRefer(true)
                  } else if (referDetail.status == '2') {
                    setIsSuccess(true)
                  }
                }}
              >
                {isMdUp && <i className='tabler-check text-[22px] text-white mr-3' />}{' '}
                {referDetail.status == 2 ? 'เสร็จสิ้น' : 'รับปรึกษา'}
              </Button>
            ) : (
              <Button variant='outlined' color='warning' className='w-full sm:w-3/12 text-warning' disabled={true}>
                อยู่ระหว่างการรักษา
              </Button>
            )}

            {referDetail.status === '1' && (
              <Button
                variant='contained'
                color='error'
                className='w-full sm:w-3/12'
                onClick={() => {
                  setIsCancel(true)
                }}
              >
                {isMdUp && <i className='tabler-x text-[22px]  text-white mr-3' />}ยกเลิกส่งตัว
              </Button>
            )}

            {/* )
             
                } */}

            {/* <Button variant='contained' onClick={forAddModal} size='medium' className='is-full sm:is-auto'>
              {isMdUp && <i className='tabler-plus text-[22px] text-white mr-3' />}
              เพิ่มประวัติ
            </Button> */}
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl' />,
                            desc: <i className='tabler-chevron-down text-xl' />
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
      <ViewOpdComponent
        title={modalTitle}
        open={isModalOpen}
        dataEditOpds={dataEditOpds === null ? '' : dataEditOpds}
        isViewOnly={isViewOnly}
        onClose={() => setModalOpen(false)}
        isCreate={isCreate}
        refreshData={refreshData}
      />
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
        <DialogTitle id='form-dialog-title'>ยืนยันการรับปรึกษา</DialogTitle>

        <DialogContent>
          <FormControl fullWidth error={hospitalError}>
            <Typography className='mb-1'>เลือกโรงพยาบาลปลายทาง</Typography>
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
        </DialogContent>

        <DialogActions className='dialog-actions-dense'>
          <Button onClick={() => handleReferSubmit(referDetail.id)} variant='outlined' className='mt-3'>
            ยืนยัน
          </Button>
          <Button onClick={handleClose} variant='outlined' color='secondary' className='mt-3'>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>

      {/* #######success modal####### */}
      <Dialog
        fullWidth
        maxWidth='md'
        open={isSuccess}
        aria-labelledby='form-dialog-title'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='form-dialog-title' className='bg-primary'>
          <div className='flex items-center space-x-2'>
            <Typography variant='h-5' className='text-white'>
              ยืนยันการส่งตัวคนไข้
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className='p-4 '>
            <Typography className='mb-2 text-lg font-semibold'>
              คุณต้องการยืนยันว่าการรักษาเสร็จสิ้น และส่งตัวคนไข้กลับโรงพยาบาลต้นทาง?
            </Typography>

            <Typography variant='h6' className='mt-4 mb-2 text-indigo-600'>
              รายละเอียด
            </Typography>

            <div className='p-4 border-l-4 border-indigo-500 bg-white shadow-md rounded-md space-y-1'>
              <Typography className='text-base font-medium text-gray-700'>
                ชื่อ-สกุล:{' '}
                <span className='text-indigo-500'>
                  {referDetail.Customer.firstnameTH} {referDetail.Customer.lastnameTH}
                </span>
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>
                โรงพยาบาลต้นทาง: <span className='text-indigo-500'>{referDetail.Hospital.name}</span>
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>
                หมายเลขที่ใช้ส่งตัวคนไข้: <span className='text-indigo-500'>{referDetail.patientPhone}</span>
              </Typography>
            </div>
          </div>
        </DialogContent>

        <DialogActions className='dialog-actions-dense'>
          <Button
            onClick={() => handleReferSuccess(referDetail.id)}
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
        <DialogTitle id='form-dialog-title' className='bg-primary'>
          <div className='flex items-center space-x-2'>
            <Typography variant='h-5' className='text-white'>
              ยกเลิกส่งตัว
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className='p-4 '>
            <Typography className='mb-2 text-lg font-semibold'>คุณต้องการยืนยันว่าจะยกเลิกการส่งตัวคนไข้</Typography>
            <Typography variant='h6' className='mt-4 mb-2 text-indigo-600'>
              รายละเอียด
            </Typography>

            <div className='p-4 border-l-4 border-amber-500 bg-white shadow-md rounded-md space-y-1'>
              <Typography className='text-base font-medium text-gray-700'>
                ชื่อ-สกุล:{' '}
                <span className='text-amber-500'>
                  {referDetail.Customer.firstnameTH} {referDetail.Customer.lastnameTH}
                </span>
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>
                โรงพยาบาลต้นทาง: <span className='text-amber-500'>{referDetail.Hospital.name}</span>
              </Typography>
              <Typography className='text-base font-medium text-gray-700'>
                หมายเลขที่ใช้ส่งตัวคนไข้: <span className='text-amber-500'>{referDetail.patientPhone}</span>
              </Typography>
            </div>
          </div>
        </DialogContent>

        <DialogActions className='dialog-actions-dense'>
          <Button
            onClick={() => handleReferCancel(referDetail.id)}
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

export default ReferOpdLists
