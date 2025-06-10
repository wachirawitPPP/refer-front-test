'use client';

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
  getPaginationRowModel,
  getSortedRowModel,
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
import TableFilters from './TableFilters';
import axios from 'axios';
import { toast } from 'react-toastify';

import { useSession } from 'next-auth/react';

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

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

const columnHelper = createColumnHelper();

const userStatusObj = {
  active: 'success',
  inactive: 'secondary',
};

const getImageAuthen =  async (path,token) =>{
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/getfileupload`, {
      params: { file_name: path },
      headers: {
        Authorization: `${token}`
      }
    });
    console.log(response.data.img)
    return response.data.img.toString();  // คืนค่า URL ใหม่ที่มีโทเคน
  } catch (error) {
    console.error('Fetch image token failed:', error);
    return path;  // หากมีข้อผิดพลาด ให้ใช้ URL เดิม
  }
}
const GetAvatar = ({ avatar, fullName }) => {
  const { data: session } = useSession();  // Using useSession hook inside a component
  const [avatarUrl, setAvatarUrl] = useState(null);  // Using useState hook inside a component

  useEffect(() => {
    if (avatar) {
      // Fetch the image URL asynchronously
      const fetchImage = async () => {
        const imgUrl = await getImageAuthen(avatar, session?.user?.token);
        setAvatarUrl(imgUrl); // Set the URL in state
      };
      fetchImage();
    }
  }, [avatar, session]);  // Dependencies for useEffect

  return avatarUrl ? (
    <CustomAvatar src={avatarUrl} size={34} />
  ) : (
    <CustomAvatar size={34}>{getInitials(fullName)}</CustomAvatar>
  );
};



const columnsDefinition = (columnHelper, locale, handleClickChangeStatus, forEditModal, hnPrefix) => [
  {
    header: 'id',
    cell: ({ row }) => row.original.id,
  },
  columnHelper.accessor('name', {
    header: 'ชื่อ-นามสกุล',
    cell: ({ row }) => (
      <div className='flex items-center gap-4'>
        {GetAvatar({ avatar: row.original.filePath , fullName: row.original.firstnameEN })}
        <div className='flex flex-col'>
          <Link href={`referTable2/${row.original.id}?id_card=${row.original.idCardNumber}`}>
            <Typography color='primary' className='font-medium'>
              {row.original.firstnameTH + ' ' + row.original.lastnameTH}
            </Typography>
            <Typography className='font-small'>{row.original.hn}</Typography>
          </Link>
        </div>
      </div>
    ),
  }),
  {
    header: 'เพศ',
    cell: ({ row }) => <div className='flex items-center gap-4'>{row.original.gender}</div>,
  },
  {
    header: 'สัญชาติ',
    cell: ({ row }) => <div className='flex items-center gap-4'>{row.original.nationality}</div>,
  },
  {
    header: 'โทร',
    cell: ({ row }) => <div className='flex items-center gap-4'>{row.original.tel}</div>,
  },
  {
    header: 'สร้างเมื่อ',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      return <div className='flex items-center gap-4'>{formattedDate}</div>;
    },
  },
  {
    header: 'สถานะ',
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <Chip color={row.original.isActive ? 'success' : 'error'} variant="tonal" className="capitalize" label={row.original.isActive ? 'ปกติ' : 'ระงับ'} size="small" />
      </div>
    ),
  },
  {
    id: 'Action',
    header: () => <div style={{ width: '100%', textAlign: 'center' }}>Action</div>,
    cell: ({ row }) => (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Link href={`referTable2/${row.original.id}?id_card=${row.original.idCardNumber}`}>
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
        <Tooltip title={row.original.isActive ? "ระงับผู้ใช้งาน" : "เปิดสิทธิ์ใช้งาน"}>
          <IconButton onClick={() => handleClickChangeStatus(row.original.id, row.original.isActive)}>
            <i data-bs-toggle="modal" className={`tabler-${row.original.isActive ? 'trash' : 'plus'} text-[22px] text-textSecondary`} />
          </IconButton>
        </Tooltip>
      </div>
    ),
  },
];

const UserTable = ({ tableData, onUpdate, hnPrefix, userSession }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(tableData);
  const [globalFilter, setGlobalFilter] = useState('');
  const [status, setStatus] = useState(null);
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

  const handleSuspend = async () => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_TEST_API_URL}/customer/${selectedRowId}/active`, { isActive: !dataStatus }, {
        headers: { Authorization: `${userSession.token}` },
      });
      onUpdate();
      toast.success('บันทึกข้อมูลสำเร็จ');
      handleClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCreate = (user) => {
    setSelectedUserData(user);
    setModalTitle('เพิ่มข้อมูลลูกค้า');
    setModalOpenAddUser(true);
    setIsCreate(true);
  };

  const forEditModal = (user) => {
    setSelectedUserData(user);
    setModalTitle(`แก้ไขข้อมูลคนไข้: ${user.firstnameTH} ${user.lastnameTH} (${hnPrefix}${user.hn})`);
    setModalOpenAddUser(true);
    setIsCreate(false);
  };

  const columns = useMemo(() => columnsDefinition(columnHelper, locale, handleClickChangeStatus, forEditModal, hnPrefix), [columnHelper, locale, hnPrefix]);

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
  });

  const forAddModal = () => {
    setSelectedUserData(null); // Clear selected user data for adding new user
    setModalTitle('เพิ่มข้อมูลลูกค้า');
    setModalOpenAddUser(true);
  };

  return (
    <>
      <Card>
        <CardHeader title='ข้อมูลคนไข้' className='pb-4' />
        <div className="flex justify-between flex-row items-center border-bs p-4 gap-4">
          <div className="w-full flex flex-col">
            <TableFilters setData={setData} tableData={tableData} />
          </div>

          {/* <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='ค้นหาชื่อ-สกุล'
            className='is-full sm:is-auto'
          /> */}
          
        </div>
        <div className='mx-4  mb-2 flex flex-row items-center'>
          {/* <p className='justify-items-center'>แสดง</p>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="sm:w-20 justify-center m-2"
          >
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="25">25</MenuItem>
            <MenuItem value="50">50</MenuItem>
          </CustomTextField>
          <p className='justify-items-center'>รายการ</p> */}
          <div className="w-full flex justify-end mx-4">
            <Button
              color="primary"
              variant="tonal"
              startIcon={<i className='tabler-plus' />}
              onClick={handleCreate}

            >
              เพิ่มคนไข้ใหม่
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
                            'cursor-pointer select-none': header.column.getCanSort(),
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='tabler-chevron-up text-xl' />,
                            desc: <i className='tabler-chevron-down text-xl' />,
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
          <Button onClick={handleSuspend} variant="outlined" color={dataStatus ? "error" : "primary"} className='mt-3'>
            {dataStatus ? 'ระงับการใช้งาน' : 'เปิดสิทธิ์ใช้งาน'}
          </Button>
          <Button onClick={handleClose} variant="outlined" color="secondary" className='mt-3'>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserTable;
