'use client'
import React, { useEffect, useState, useMemo } from 'react'
import {
  Card,
  CardHeader,
  Button,
  Typography,
  Chip,
  IconButton,
  styled,
  TablePagination,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import classnames from 'classnames'
import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@components/TablePaginationComponent'
import select from '@/@core/theme/overrides/select'
import DataModaleComponent from '../component/data-modal-component'




const columnHelper = createColumnHelper()

const Columns = ({ columnHelper, handleOpenDataDialog, handleOpenResultDialog }) =>
  useMemo(
    () => [
      columnHelper.display({
        id: 'index',
        header: 'HN',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.hn ?? '-'}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('name', {
        header: 'ชื่อ-นามสกุล',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.name ?? '-'}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('updatedAt', {
        // Changed the accessor to 'updatedAt'
        header: 'วันที่ปรึกษา',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original?.updatedAt
                  ? new Date(row.original.updatedAt).toLocaleString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                      hour12: false // 24-hour format
                    })
                  : '-'}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('data', {
        header: 'ข้อมูล',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Tooltip title='ดูข้อมูล'>
              <Button className='group' onClick={() => handleOpenDataDialog(row.original)}>
                {'ดูข้อมูล '}
                <i className='tabler-arrow-narrow-right transition-transform duration-300 ease-in-out group-hover:translate-x-2' />
              </Button>
            </Tooltip>
          </div>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('result', {
        header: 'ผลการประเมิน',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Tooltip title='ผลการประเมิน'>
              <Button className='group' onClick={() => handleOpenResultDialog(row.original)}>
                {'ดูผลการประเมิน '}
                <i className='tabler-arrow-narrow-right transition-transform duration-300 ease-in-out group-hover:translate-x-2' />
              </Button>
            </Tooltip>
          </div>
        ),
        enableSorting: false
      })
    ],
    [columnHelper, handleOpenDataDialog, handleOpenResultDialog]
  )

const ConsultTable = tableData => {
  const [data, setData] = useState(tableData.tableData)
  const [dataDialog, setDataDialog] = useState(false)
  const [resultDialog, setResultDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  

  const handleOpenDataDialog = patient => {
    setDataDialog(true)
    setSelectedUser(patient)
  }
  const handleOpenResultDialog = patient => {
    window.open(`/consult-noac/consult-detail/${patient.id_card}`, '_blank')
    setSelectedUser(patient)
  }

  const [globalFilter, setGlobalFilter] = useState('')
  const columns = Columns({
    columnHelper,
    handleOpenDataDialog,
    handleOpenResultDialog
  })
  const globalFilterFn = (rows, columnIds, filterValue) => {
    return rows.filter(row => {
      return columnIds.some(columnId => {
        const value = row.getValue(columnId)
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
      })
    })
  }
  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: globalFilterFn },
    state: { globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <>
      <div className='overflow-x-auto h-96 p-4'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div>
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
      <Dialog
        open={dataDialog}
        maxWidth='lg'
        fullWidth
        fullScreen
        sx={{
          '& .MuiPaper-root': {
            height: 'dvh', // Adjust this value as needed for your desired height
            maxHeight: '90vh' // Set max height to control overflow
          }
        }}
      >
        
        <DialogContent>
          <div className='mb-2'>
          <Typography variant='h5'>
            HN: {selectedUser?.hn}
          </Typography>
          <Typography variant='h5'>
            ชื่อ-นามสกุล: {selectedUser?.name}
          </Typography>

          </div>
          <DataModaleComponent selectedUser={selectedUser} />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={() => setDataDialog(false)}>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={resultDialog} maxWidth='lg' fullWidth>
        <DialogTitle>kkk</DialogTitle>
        <DialogContent>asdasd</DialogContent>
        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={() => setResultDialog(false)}>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConsultTable
