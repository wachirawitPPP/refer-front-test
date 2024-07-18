'use client'

import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  Button,
  Typography,
  Chip,
  IconButton,
  TablePagination,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
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
} from '@tanstack/react-table';
import TablePaginationComponent from '@components/TablePaginationComponent';
import CustomTextField from '@core/components/mui/TextField';
import CustomAvatar from '@core/components/mui/Avatar';
import { getInitials } from '@/utils/getInitials';
import tableStyles from '@core/styles/table.module.css';
import AddUserComponent from './addModalComponent';
import Link from 'next/link';
import { rankItem } from '@tanstack/match-sorter-utils';
import classnames from 'classnames';
import { useParams } from 'next/navigation';

// Filter Function
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

// Debounced Input Component
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />;
};

// Column Definitions
const columnHelper = createColumnHelper();

const userStatusObj = {
  active: 'success',
  inactive: 'secondary'
};

const getAvatar = ({ avatar, fullName }) => {
  if (avatar) {
    return <CustomAvatar src={avatar} size={34} />;
  } else {
    return <CustomAvatar size={34}>{getInitials(fullName)}</CustomAvatar>;
  }
};

const Columns = ({ columnHelper, locale, handleClickChangeStatus, forEditModal }) => useMemo(() => [
  {
    header: 'id',
    cell: ({ row }) => (
      row.original.id
    )
  },
  
  columnHelper.accessor('name', {
    header: 'ชื่อ-นามสกุล',
    cell: ({ row }) => (
      <div className='flex items-center gap-4'>
        {getAvatar({ avatar: row.original.avatar, fullName: row.original.firstnameEN })}
        <div className='flex flex-col'>
          <Link href={`referTable2/${row.original.id}`}>
            <Typography color='text.primary' className='font-medium'>
              {row.original.firstnameTH + ' ' + row.original.lastnameTH}
            </Typography>
            <Typography className='font-small'>
              {row.original.hn}
            </Typography>
          </Link>
        </div>
      </div>
    )
  }),
  {
    header: 'เพศ',
    cell: ({ row }) => (
      <div className='flex items-center gap-4'>
        {row.original.gender}
      </div>
    )
  },
  {
    header: 'สัญชาติ',
    cell: ({ row }) => (
      <div className='flex items-center gap-4'>
        {row.original.nationality}
      </div>
    )
  },
  {
    header: 'โทร',
    cell: ({ row }) => (
      <div className='flex items-center gap-4'>
        {row.original.tel}
      </div>
    )
  },
  
  {
    header: 'สร้างเมื่อ',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

      return (
        <div className='flex items-center gap-4'>
          {formattedDate}
        </div>
      );
    }
  },
  {
    header: 'สถานะ',
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <Chip color={row.original.isActive ? 'success' : 'error'} variant="tonal" className="capitalize" label={row.original.isActive ? 'ปกติ' : 'ระงับ'} size="small" />
      </div>
    )
  },
  {
    id: 'Action',
    header: () => (
      <div style={{ width: '100%', textAlign: 'center' }}>
        Action
      </div>
    ),
    cell: ({ row }) => (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Link href={`referTable2/${row.original.id}`}>
          <Tooltip title="ดูข้อมูล">
            <IconButton>
              <i data-bs-toggle="modal" className='tabler-eye text-[22px] text-textSecondary' />
            </IconButton>
          </Tooltip>
        </Link>
        <Tooltip title="แก้ไขข้อมูล">
          <IconButton onClick={() => forEditModal(row.original)}>
            <i data-bs-toggle="modal" className='tabler-edit text-[22px] text-textSecondary' />
          </IconButton>
        </Tooltip>
        {row.original.status === 'active' ?
          <Tooltip title="ระงับผู้ใช้งาน">
            <IconButton onClick={() => handleClickChangeStatus(row.original.id, row.original.status)}>
              <i data-bs-toggle="modal" className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
          </Tooltip>
          :
          <Tooltip title="เปิดสิทธิ์ใช้งาน">
            <IconButton onClick={() => handleClickChangeStatus(row.original.id, row.original.status)}>
              <i data-bs-toggle="modal" className='tabler-plus text-[22px] text-textSecondary' />
            </IconButton>
          </Tooltip>
        }
      </div>
    ),
  }
], [columnHelper, locale])

const UserTable = ({ tableData, onUpdate }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(tableData);
  const [globalFilter, setGlobalFilter] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpenAddUser, setModalOpenAddUser] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [dataStatus, setDataStatus] = useState();
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [isCreate, setIsCreate] = useState(false);

  const { lang: locale } = useParams();

  useEffect(() => {
    setData(tableData); // Update the data state whenever tableData prop changes
  }, [tableData]);

  const handleClickChangeStatus = (id, status) => {
    setSelectedRowId(id);
    setOpen(true);
    setDataStatus(status);
  };

  const handleClose = () => setOpen(false);
  const handleSuspend = () => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id === selectedRowId
          ? { ...row, status: row.status === 'active' ? 'inactive' : 'active' }
          : row
      )
    );
    handleClose();
  };

  const handleCreate = (user) =>{
    setSelectedUserData(user);
    setModalTitle('เพิ่มข้อมูลลูกค้า');
    setModalOpenAddUser(true);
    setIsCreate(true);
  };

  const forEditModal = (user) => {
    setSelectedUserData(user);
    setModalTitle('แก้ไขข้อมูลคนไข้ ID : ' + user.id);
    setModalOpenAddUser(true);
    setIsCreate(false);
  };

  const columns = Columns({ columnHelper, locale, handleClickChangeStatus, forEditModal });

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
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
  });

  const forAddModal = () => {
    setSelectedUserData(null); // Clear selected user data for adding new user
    setModalTitle('เพิ่มข้อมูลลูกค้า');
    setModalOpenAddUser(true);
  };

  return (
    <>
      <Card>
        <CardHeader title='ข้อมูลคนไข้' className='pbe-4' />
        <div className='flex justify-end flex-col items-start w-full md:flex-row md:items-center p-6 border-bs gap-4'>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4'>
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
              value={status}
              onChange={e => setStatus(e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value=''>Select Status</MenuItem>
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='inactive'>Inactive</MenuItem>
            </CustomTextField>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='ค้นหาชื่อ-สกุล'
              className='is-full sm:is-auto'
            />
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={handleCreate}
              className='is-full sm:is-auto'
            >
              เพิ่มลูกค้า
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
            table.setPageIndex(page);
          }}
        />
      </Card>
      <AddUserComponent
        modalTitle={modalTitle}
        open={isModalOpenAddUser}
        onClose={() => setModalOpenAddUser(false)}
        selectedUserData={selectedUserData}
        isCreate={isCreate}
        onUpdate={onUpdate}
      />
      <Dialog open={open} aria-labelledby='form-dialog-title' onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          handleClose();
        }
      }}>
        <DialogTitle id='form-dialog-title'>แก้ไขสิทธิ์ใช้งาน</DialogTitle>
        <DialogContent>
          <DialogContentText className='mbe-3'>
            คุณต้องการแก้ไขสิทธิ์ใช้งาน user id : {selectedRowId} หรือไม่
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          {dataStatus === 'active' ?
            <Button onClick={handleSuspend} variant="outlined" color="error" className='mt-3'>
              ระงับการใช้งาน
            </Button>
            :
            <Button onClick={handleSuspend} variant="outlined" color="primary" className='mt-3'>
              เปิดสิทธิ์ใช้งาน
            </Button>
          }
          <Button onClick={handleClose} variant="outlined" color="secondary" className='mt-3'>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserTable;
