'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Chip from '@mui/material/Chip'

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
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Vars
const projectTable = [
  {
    id: 1,
    hours: '18:42',
    progressValue: 'LOGIN', 
    progressColor: 'success', 
    projectTitle: '2024-09-09', 
  },
  {
    id: 2,
    hours: '20:42',
    progressValue: 'LOGOUT', 
    progressColor: 'error', 
    projectTitle: '2024-09-09', 
  },
  {
    id: 3,
    hours: '09:15',
    progressValue: 'LOGIN', 
    progressColor: 'success', 
    projectTitle: '2024-09-10', 
  },
  {
    id: 4,
    hours: '10:27',
    progressValue: 'LOGOUT', 
    progressColor: 'error', 
    projectTitle: '2024-09-10', 
  },
  {
    id: 5,
    hours: '08:10',
    progressValue: 'LOGIN', 
    progressColor: 'success', 
    projectTitle: '2024-09-11', 
  },
  {
    id: 6,
    hours: '17:37',
    progressValue: 'LOGOUT', 
    totalTask: '99/109',
    progressColor: 'error',  
    projectTitle: '2024-09-11', 
  },
  {
    id: 7,
    hours: '07:20',
    progressValue: 'LOGIN', 
    progressColor: 'success', 
    projectTitle: '2024-09-12', 
  },
]

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper()

const ProjectListTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})

  const [data, setData] = useState(...[projectTable])
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const columns = useMemo(
    () => [
      columnHelper.accessor('projectTitle', {
        header: 'วัน/เวลา เข้าใช้งาน',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* <CustomAvatar src={row.original.img} size={34} /> */}
            <div className='flex flex-col'>
              <Typography   color='text.primary'>
                {`วันที่: ${row.original.projectTitle}`}
              </Typography>
              <Typography variant='body4'>{`เวลา: ${row.original.hours}`}</Typography>
            </div>
          </div>
        )
      }),
      // columnHelper.accessor('hours', {
      //   header: 'เวลา',
      //   cell: ({ row }) => <Typography>{`${row.original.hours} น.`}</Typography>
      // }),
      // columnHelper.accessor('totalTask', {
      //   header: 'เวลา',
      //   cell: ({ row }) => <Typography color='text.primary'>{row.original.totalTask}</Typography>
      // }),
      columnHelper.accessor('progressValue', {
        header: 'transaction',
        cell: ({ row }) => (
          <>
            {/* <Typography color='text.primary'>{`${row.original.progressValue}%`}</Typography>
            <LinearProgress
              color={row.original.progressColor}
              value={row.original.progressValue}
              variant='determinate'
              className='is-full'
            /> */}
            <div className='flex items-center gap-3'>
            <Chip
              variant='tonal'
              className='capitalize'
              label={row.original.progressValue}
              color={row.original.progressColor}
              size='small'
            />
          </div>
          </>
        )
      }),

    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 7
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
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
    <Card>
      <CardHeader title='Login Transaction' className='flex flex-wrap gap-4' />
      <div className='flex items-center justify-between p-6 gap-4'>
        <div className='flex items-center gap-2'>
          <Typography>Show</Typography>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value='5'>5</MenuItem>
            <MenuItem value='7'>7</MenuItem>
            <MenuItem value='10'>10</MenuItem>
          </CustomTextField>
        </div>
        {/* <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search Project'
        /> */}
      </div>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
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
                      </>
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
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => {
                  return (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  )
                })}
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
  )
}

export default ProjectListTable
