'use client'
import React, { useEffect, useState, useMemo } from 'react';
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
  Tooltip
} from '@mui/material';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import classnames from 'classnames';
import TableFilters from './TableFilters';
import OptionMenu from '@core/components/option-menu';
import TablePaginationComponent from '@components/TablePaginationComponent';
import CustomTextField from '@core/components/mui/TextField';
import DepartmentSettingModal from './DepartmentSettingModal';
import tableStyles from '@core/styles/table.module.css';
import axios from 'axios';
import { toast, Flip } from 'react-toastify'

import { useSession } from 'next-auth/react';



// Styled Components
const Icon = styled('i')({});

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

  return <CustomTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
};

// Column Definitions
const columnHelper = createColumnHelper();

const Columns = ({ columnHelper, handleEditClick, handleStatusChange }) =>
  useMemo(
    () => [
      columnHelper.accessor((row, index) => index + 1, {
        id: 'index',
        header: '#',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('name', {
        header: 'ชื่อ',
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row.original.name}
              </Typography>
              <Typography variant='body2'>รหัสแผนก / หน่วยงาน: {row.original.departmentCode}</Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'สถานะ',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip color={row.original.isActive ? 'success' : 'error'} variant="tonal" className="capitalize" label={row.original.isActive ? 'ปกติ' : 'ระงับ'} size="small" />
          </div>
        ),
      }),
      columnHelper.accessor('secretKey', {
        header: 'line notify secret key ',
        cell: ({ row }) => (
          <Typography className="capitalize" color="text.primary">
            {row.original.secretKey}
          </Typography>
        ),
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton onClick={() => handleEditClick('edit', row.original)}>
              <i className="tabler-edit text-[22px] text-textSecondary" />
            </IconButton>
            {row.original.isActive ?
              <Tooltip title="ระงับผู้ใช้งาน">
                <IconButton onClick={() => handleStatusChange(row.original)}>
                  <i data-bs-toggle="modal" className='tabler-trash text-[22px] text-textSecondary' />
                </IconButton>
              </Tooltip>
              :
              <Tooltip title="เปิดสิทธิ์ใช้งาน">
                <IconButton onClick={() => handleStatusChange(row.original)}>
                  <i data-bs-toggle="modal" className='tabler-plus text-[22px] text-textSecondary' />
                </IconButton>
              </Tooltip>
            }
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [columnHelper, handleEditClick, handleStatusChange]
  );

const UserSettingTable = ({ tableData, onUpdate }) => {
  const [data, setData] = useState(tableData);
  const [globalFilter, setGlobalFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState('edit');
  const [isEdit, setIsEdit] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const { data: session, status } = useSession();

  const handleCreateClick = (user) => {
    setIsCreate(true);
    setSelectedUser(user);
    setMode('create');
    setModalOpen(true);
    setIsEdit(false);
  };

  const handleEditClick = (mode, user) => {
    setSelectedUser(user);
    setMode(mode);
    setModalOpen(true);
    setIsEdit(true);
  };

  const handleStatusChange = async (user) => {
    setSelectedUser(user);
    
    const data = {
      isActive: !user.isActive
    };

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_TEST_API_URL}/departmentStatus/${user.id}`,data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${session.user.token}`
        },
      });
      toast.success('บันทึกข้อมูลสำเร็จ', {
        position: 'top-right',
        autoClose: 5000,
        transition: Flip,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
      });
  
      console.log(response.data);
      onUpdate();
      
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด',error, {
        position: 'top-right',
        autoClose: 5000,
        transition: Flip,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
      });
    }

    
  };

  const columns = Columns({
    columnHelper,
    handleEditClick,
    handleStatusChange
  });

  const fuzzyFilter = (rows, columnIds, filterValue) => {
    if (!Array.isArray(rows)) return [];
    return rows.filter((row) => {
      return columnIds.some((columnId) => {
        const value = row.getValue(columnId);
        return value !== undefined
          ? String(value).toLowerCase().includes(String(filterValue).toLowerCase())
          : true;
      });
    });
  };

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  const handleUserChange = (updatedUser) => {
    setSelectedUser(updatedUser);
  };

  const handleSaveChanges = () => {
    if (isEdit) {
      setData(data.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
    }
    setSelectedUser(null);
    setModalOpen(false);
    onUpdate();
  };

  const handleSearch = () => {
    setGlobalFilter(searchInput);
  };

  return (
    <>
      <Card>
        <CardHeader title="ตัวกรองข้อมูล" className="pbe-4" />

        <TableFilters setData={setData} tableData={tableData} />
        <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4">
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="is-[70px]"
          >
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="25">25</MenuItem>
            <MenuItem value="50">50</MenuItem>
          </CustomTextField>
          <div className="flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4">
            <Button
              color="primary"
              variant="tonal"
              startIcon={<i className="tabler-plus" />}
              className="is-full sm:is-auto"
              onClick={() =>
                handleCreateClick({
                  name: '',
                  departmentCode: '',
                  secretKey: ''
                })
              }
            >
              เพิ่มผู้ใช้
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort(),
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className="tabler-chevron-up text-xl" />,
                            desc: <i className="tabler-chevron-down text-xl" />,
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
                  <td colSpan={table.getVisibleFlatColumns().length} className="text-center">
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map((row, index) => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map((cell) => (
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
      {selectedUser && (
        <DepartmentSettingModal
          title={isEdit ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
          user={selectedUser}
          onChange={handleUserChange}
          onSave={handleSaveChanges}
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          isEdit={isEdit}
          isCreate={isCreate}
        />
      )}

      
    </>
  );
};

export default UserSettingTable;
