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
  Tooltip,
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
import CustomAvatar from '@core/components/mui/Avatar';
import UserSettingModal from './UserSettingModal';
import { getInitials } from '@/utils/getInitials';
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
const userStatusObj = {
  true: 'success',
  false: 'error',
};

const getAvatar = ({ avatar, fullName }) => {
  if (avatar) {
    return <CustomAvatar src={avatar} size={34} />;
  } else {
    return <CustomAvatar size={34}>{getInitials(fullName)}</CustomAvatar>;
  }
};

const Columns = ({ columnHelper, handleEditClick, handleStatusChange }) =>
  useMemo(
    () => [
      columnHelper.display({
        id: 'index',
        header: '#',
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor('name', {
        header: 'ชื่อผู้ใช้',
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            {getAvatar({ avatar: row.original.image, fullName: row.original.name })}
            <div className="flex flex-col">
              <Typography color="text.primary" className="font-medium">
                {row.original.username}
              </Typography>
              <Typography color="text.secondary" className="font-medium">
                {row.original.name}
              </Typography>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'สถานะบัญชี',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip
              variant="tonal"
              className="capitalize"
              color={userStatusObj[row.original.isActive]}
              label={row.original.isActive ? 'ใช้งาน' : 'ระงับ'}
              size="small"
            />
          </div>
        ),
      }),
      columnHelper.accessor('department', {
        header: 'หน่วยงาน / แผนก',
        cell: ({ row }) => (
          <Typography className="capitalize" color="text.primary">
            {!null ? row.original.departmentName: 'admin'}
          </Typography>
        ),
      }),
      columnHelper.accessor('role', {
        header: 'ตำแหน่ง',
        cell: ({ row }) => (
          <Typography className="capitalize" color="text.primary">
            {row.original.role}
          </Typography>
        ),
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex items-center">
            <Tooltip title="แก้ไขข้อมูล">
              <IconButton onClick={() => handleEditClick('edit', row.original)}>
                <i className="tabler-edit text-[22px] text-textSecondary" />
              </IconButton>
            </Tooltip>
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
    [columnHelper, handleEditClick,handleStatusChange]
  );

const UserSettingTable = ({ tableData, department, onUpdate }) => {
  const [data, setData] = useState(tableData);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { data: session, status } = useSession();

  const handleEditClick = (mode, user) => {
    setSelectedUser(user);
    setIsEdit(mode === 'edit');
    setModalOpen(true);
  };
  const handleStatusChange = async (user) => {
    setSelectedUser(user);
    
    const data = {
      isActive: !user.isActive
    };

    const response = await axios.put(`${process.env.NEXT_PUBLIC_TEST_API_URL}/user-status/${user.id}`,data, {
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
  };

  const columns = Columns({
    columnHelper,
    handleEditClick,
    handleStatusChange
  });

  const globalFilterFn = (rows, columnIds, filterValue) => {
    return rows.filter((row) => {
      return columnIds.some((columnId) => {
        const value = row.getValue(columnId);
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      });
    });
  };

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
    getPaginationRowModel: getPaginationRowModel(),
  });

  

  const handleUserChange = (updatedUser) => {
    setSelectedUser(updatedUser);
  };

  const handleSaveChanges = () => {
    if (isEdit) {
      setData(data.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
    } else {
      setData([...data, { ...selectedUser, id: data.length + 1 }]);
    }
    
    setSelectedUser(null);
    setModalOpen(false);
    onUpdate()
  };

  const handleAddClick = () => {
    setSelectedUser({
      username: '',
      name: '',
      email: '',
      role: '',
      department: '',
      password: '',
      image: '',
      imageFile: null,
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader title="Filters" className="pbe-4" />
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
              onClick={handleAddClick}
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
                        <div>
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
                {table.getRowModel().rows.map((row) => (
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
        <UserSettingModal
          title={isEdit ? 'ตั้งค่าผู้ใช้' : 'เพิ่มผู้ใช้'}
          user={selectedUser}
          onChange={handleUserChange}
          onSave={handleSaveChanges}
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          isEdit={isEdit}
          department={department}
         
        />
      )}
    </>
  );
};

export default UserSettingTable;
