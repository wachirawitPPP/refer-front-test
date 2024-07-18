'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

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
  Tooltip
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

const Columns = ({ columnHelper, locale, forEditModal, forViewModal }) => useMemo(() => [
  {
    header: '#',
    accessor: 'rowCount',
    cell: ({ row }) => (
      <div>{row.index + 1}</div>
    )
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
    cell: ({ row }) => (
      row.original.id
    )
  }),
  {
    header: 'ชื่อ-นามสกุล',
    cell: ({ row }) => (
      row.original.name
    )
  },
  {
    header: 'แผนก/หน่วยงาน',
    cell: ({ row }) => (
      row.original.department
    )
  },
  {
    header: 'แพทย์ผู้ทำรายการ',
    cell: ({ row }) => (
      row.original.createBy
    )
  },
  {
    header: 'ประเภท',
    cell: ({ row }) => (
      row.original.type
    )
  },
  {
    header: 'สร้างเมื่อ',
    cell: ({ row }) => (
      row.original.createAt
    )
  },
  {
    header: 'สถานะ',
    cell: ({ row }) => (
      <Chip
        variant='tonal'
        className='capitalize'
        label={row.original.status}
        color={userStatusObj[row.original.status]}
        size='small'
      />
    )
  },

  {
    // header: 'ตัวเลือก',
    id: 'Action',
    header: () => (
      <div style={{width:'100%',textAlign:'center'}}>
          ตัวเลือก
      </div>
    ),
    cell: ({ row }) => (
      <div style={{width:'100%',textAlign:'center'}}>
        <Tooltip title="ดูข้อมูล">
          <IconButton onClick={() => forViewModal(row.original.id)}>
            <i data-bs-toggle="modal" className='tabler-eye text-[22px] text-textSecondary' />
          </IconButton>
        </Tooltip>
        <Tooltip title="แก้ไขข้อมูล">
          <IconButton onClick={() => forEditModal(row.original.id)}>
            <i data-bs-toggle="modal" className='tabler-edit text-[22px] text-textSecondary' />
          </IconButton>
        </Tooltip>
      </div>
    ),
    enableSorting: false
  }
], [columnHelper, locale])

const UserHistoryTable = ({ tableData, user }) => {
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(tableData)
  const [globalFilter, setGlobalFilter] = useState('')
  const [status, setStatus] = useState('')
  const [department, setDepartment] = useState('')
  const [docName, setDocName] = useState('')

  const [isModalOpen, setModalOpen] = useState(false)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [isRefer, setIsRefer] = useState(false)

  // console.log(rowSelection)
  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (status && user.status !== status) return false
      if (department && user.department !== department) return false
      if (docName && user.createBy !== docName) return false
      return true
    })

    setData(filteredData)
  }, [status, tableData, setData, department,docName])

  const { lang: locale } = useParams()

  const forAddModal = () => {
    setModalTitle('เพิ่มการซักประวัติ')
    setModalOpen(true)
    setIsViewOnly(false)
  }
  const forEditModal = (id) => {
    setModalTitle('เพิ่มการซักประวัติ-แก้ไข ID : ' + id)
    setModalOpen(true)
    setIsViewOnly(false)
  }
  const forViewModal = (id) => {
    setModalTitle('รายละเอียด ID : ' + id)
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
            <Button variant='contained' size='medium' color='success' className='is-full sm:is-auto'
              onClick={() => { setIsRefer(true) }}
            > {isMdUp && <i className='tabler-ambulance text-[22px] text-white mr-3' />} ส่งตัว  </Button>
            <Button variant='contained' size='medium' color='info' className='is-full sm:is-auto'
              // onClick={() => { setIsRefer(true) }}
            > {isMdUp && <i className='tabler-report-medical text-[22px] text-white mr-3' />} รับตัว  </Button>

            <Button
              variant='contained'
              onClick={forAddModal}
              size='medium' className='is-full sm:is-auto'
            >
              {isMdUp && <i className='tabler-plus text-[22px] text-white mr-3' />}
              เพิ่มประวัติ
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} >
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
        isViewOnly={isViewOnly}
        onClose={() => setModalOpen(false)}
      />
      <StepperCustomHorizontal isCreate={true}
        open={isRefer}
        onClose={() => { setIsRefer(false) }}
        selectedUser={user}

      />

    </>
  )
}

export default UserHistoryTable
