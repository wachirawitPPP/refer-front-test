'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
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
  Typography
} from '@mui/material'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
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
import StepperCustomHorizontal from '@/views/pages/refer/step-refer-modal'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import AddUserComponenet from './addModalComponent'
import { date } from 'valibot'
// Filter Function
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

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
        cell: ({ row }) => row.original.opd_code
      }),
      {
        header: 'ชื่อ-นามสกุล',
        cell: ({ row }) => {
          const datatest = row.original.length
          return (
            <div className='flex items-center gap-4'>
              {datatest}
              <div className='flex flex-col'>
                <Typography color='text.primary' className='font-medium'>
                  {row.original.Customer.firstnameTH + ' ' + row.original.Customer.lastnameTH}
                </Typography>
                <Typography className='font-small'>{row.original.hn}</Typography>
              </div>
            </div>
          )
        }
      },
      {
        header: 'แผนก/หน่วยงาน',
        cell: ({ row }) => row.original.Department == null ?  row.original.api_department_name : row.original.Department.name  
      },
      {
        header: 'แพทย์ผู้ทำรายการ',
        cell: ({ row }) => row.original.opd_docName
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
          const date = new Date(row.original.opd_date)
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
              color={row.original.isActive ? 'success' : 'error'}
              variant='tonal'
              className='capitalize'
              label={row.original.isActive ? 'ปกติ' : 'ระงับ'}
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
            <Tooltip title='ดูข้อมูล'>
              <IconButton onClick={() => forViewModal(row.original)}>
                <i data-bs-toggle='modal' className='tabler-eye text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='แก้ไขข้อมูล'>
              <IconButton onClick={() => forEditModal(row.original)}>
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

const UserHistoryTable = ({ tableData, user }) => {
  console.log(user.isRefer)
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
  const [isCreate, setIsCreate] = useState(false)
  const [dataEditOpds, setDataEditOpds] = useState(null)
  const { data: session } = useSession()
  const [dateExpires, setDateExpires] = useState('')
  const GetDataAPI_Ephis = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/apiEphis/login`, {
        headers: {
          Authorization: `${session.user?.token}`
        }
      })
      .then(async response => {
        //console.log(response.data)
        //console.log('token2', response.data.data.token) 
        const token2 = response.data.data.token
        // axios
        //   .get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/erfer`,{
        //     headers: {
        //       Authorization: `${token2}` // Send the token with the request
        //     },
        //     params: {
        //       idcard: "3451300020360",
        //       files: "7"
        //     },
        //   })
        //   .then(response1 => {
        //     console.log('Erefer', response1.data)
        //   })
        //   .catch(error => {
        //     console.error(error)
        //   })

        const [api1Response, api2Response] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/erfer`, {
            headers: {
              Authorization: `${token2}`
            },
            params: {
              idcard: "3451300020360",
              files: "6"
            },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/erfer`, {
            headers: {
              Authorization: `${token2}`
            },
                params: {
                  idcard: "3451300020360",
                  files: "7"
                },
          })
        ]);

        const data1 = api1Response.data.Result;
        const data2 = api2Response.data.Result;

          // map ข้อมูลโดยใช้ setid_
          // const mappedData = data1.map((item1) => {
          //   const match = data2.find((item2) => item2.SETID_PV1 === item1.SETID_PV1);
          //   return {
          //     ...item1,
          //     ...match
          //   };
          // });

                 // ใช้ reduce เพื่อลดข้อมูลให้มี SETID_PV1 ที่ซ้ำกันเป็น array เดียว
        const groupedData2 = data1.reduce((acc, item) => {
          if (!acc[item.SETID_PV1]) {
            acc[item.SETID_PV1] = [];
          }
          acc[item.SETID_PV1].push(item);
          return acc;
        }, {});

        // map ข้อมูลจาก API 1 และรวมข้อมูลจาก API 2 ที่ซ้ำกันเป็น array
        const mappedData = data2.map((item1) => {
          const matches = groupedData2[item1.SETID_PV1];
          return {
            ...item1,
            api1Data: matches || [] // ถ้าไม่มีการแมพก็จะได้ array ว่าง
          };
        });

          console.log("DataMap", mappedData)
      })
      .catch(error => {
        if (error.response) {
          console.error('Error data:', error.response.data)
          console.error('Error status:', error.response.status)
          console.error('Error headers:', error.response.headers)
        } else {
          console.error('Error:', error.message)
        }
      })
    //console.log("response", response)
  }
  //GetDataAPI_Ephis()

  // console.log(rowSelection)
  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (status && user.status !== status) return false
      if (department && user.department !== department) return false
      if (docName && user.createBy !== docName) return false
      return true
    })

    setData(filteredData)
    const expiresTimeOut = "2024-09-13T17:15:45.2682322+07:00"
    const dateNowExpire = new Date(expiresTimeOut).getTime()
    const dateNow = new Date().getTime()
    const Calcu = dateNowExpire - dateNow
    console.log("dateExpire",dateExpires)
    console.log("dateNow",dateNow)
    console.log("Calcu",Calcu)
  }, [status, tableData, setData, department, docName])

  const { lang: locale } = useParams()

  const forAddModal = () => {
    setModalTitle('เพิ่มการซักประวัติ')
    setModalOpen(true)
    setIsViewOnly(false)
    setIsCreate(true)
  }
  const forEditModal = data => {
    console.log(data)
    setDataEditOpds(data)
    setModalTitle('เพิ่มการซักประวัติ-แก้ไข ID : ' + data.id)
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
  const handleRefer = () => {
    setIsRefer(true)
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
            {!user.isRefer && (
              <Button
                variant='contained'
                size='medium'
                color='success'
                className='is-full sm:is-auto'
                onClick={() => {
                  setIsRefer(true)
                }}
              >
                {' '}
                {isMdUp && <i className='tabler-ambulance text-[22px] text-white mr-3' />} ส่งตัว{' '}
              </Button>
            )}

            {user.isRefer && (
              <Button
                variant='contained'
                size='medium'
                color='info'
                className='is-full sm:is-auto'
                onClick={() => {
                  setIsRefer(true)
                }}
              >
                {isMdUp && <i className='tabler-report-medical text-[22px] text-white mr-3' />}รับตัว
              </Button>
            )}

            <Button variant='contained' onClick={forAddModal} size='medium' className='is-full sm:is-auto'>
              {isMdUp && <i className='tabler-plus text-[22px] text-white mr-3' />}
              เพิ่มประวัติ
            </Button>
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
      <AddUserComponenet
        title={modalTitle}
        open={isModalOpen}
        dataEditOpds={dataEditOpds === null ? '' : dataEditOpds}
        isViewOnly={isViewOnly}
        onClose={() => setModalOpen(false)}
        isCreate={isCreate}
      />
      <StepperCustomHorizontal
        isCreate={true}
        open={isRefer}
        onClose={() => {
          setIsRefer(false)
        }}
        selectedUser={user}
      />
    </>
  )
}

export default UserHistoryTable
