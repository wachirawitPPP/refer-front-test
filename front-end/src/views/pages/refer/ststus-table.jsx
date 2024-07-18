import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Typography,
  Chip,
  IconButton,
  styled,
  TablePagination,
  Tooltip,
} from '@mui/material';
import classnames from 'classnames';
import { rankItem } from '@tanstack/match-sorter-utils';
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
  getSortedRowModel,
} from '@tanstack/react-table';
import OptionMenu from '@core/components/option-menu';
import TablePaginationComponent from '@components/TablePaginationComponent';
import CustomTextField from '@core/components/mui/TextField';
import CustomAutocomplete from '@core/components/mui/Autocomplete';
import CustomAvatar from '@core/components/mui/Avatar';
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';
import axios from 'axios';
import { getInitials } from '@/utils/getInitials';
import tableStyles from '@core/styles/table.module.css';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import EditDialog from './refer-modal'; // Import the new EditDialog component

const Icon = styled('i')({});

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

  return <CustomTextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
};

const columnHelper = createColumnHelper();

const userStatusObj = {
  Urgency: 'warning',
  Elective: 'secondary',
  Emergency: 'error',
};

const statusObj = {
  เสร็จสิ้น:'success',
  ยกเลิก:'error'

}

const getAvatar = ({ avatar }) => {
  if (avatar) {
    return <CustomAvatar src={avatar} size={34} />;
  }
};

const Columns = ({ columnHelper, locale, handleEdit, isCancel }) =>
  useMemo(
    () => {
      const baseColumns = [
        {
          header: 'id',
          cell: ({ row }) => row.original.id,
        },
        columnHelper.accessor('name', {
          header: 'ชื่อ-นามสกุล',
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>
              {getAvatar({ avatar: row.original.attributes.avatar })}
              <div className='flex flex-col'>
                <Link href={`referTable2/${row.original.id}`}>
                  <Typography color='text.primary' className='font-medium'>
                    {row.original.attributes.name}
                  </Typography>
                  <Typography className='font-small'>{row.original.attributes.hn}</Typography>
                </Link>
              </div>
            </div>
          ),
        }),
        {
          header: 'ความเร่งด่วน',
          cell: ({ row }) => (
            <div className='flex items-center gap-3'>
              <Chip
                variant='tonal'
                className='capitalize'
                label={row.original.attributes.urgent}
                color={userStatusObj[row.original.attributes.urgent]}
                size='small'
              />
            </div>
          ),
        },
        {
          header: 'โรงพยาบาลต้นทาง',
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>{row.original.attributes.originHospital}</div>
          ),
        },
        {
          header: 'โรงพยาบาลปลายทาง',
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>{row.original.attributes.destinationHospital}</div>
          ),
        },
        {
          header: 'วันที่สร้างรายการ',
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>{new Date(row.original.attributes.referDate).toLocaleString()}</div>
          ),
        },
        {
          header: 'วันที่รับรายการ',
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>{new Date(row.original.attributes.confirmDate).toLocaleString()}</div>
          ),
        },
        {
          header: 'แผนก/หน่วยงาน',
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>{row.original.attributes.department}</div>
          ),
        },
        {
          header: 'แพทย์ส่งตัว',
          cell: ({ row }) => (
            <div className='flex items-center gap-4'>{row.original.attributes.originHospital}</div>
          ),
        },
        {
          header: 'สถานะ',
          cell: ({ row }) => (
            <div className='flex items-center gap-3'>
              <Chip
                variant='tonal'
                className='capitalize'
                label={row.original.attributes.status}
                color={statusObj[row.original.attributes.status]}
                size='small'
              />
            </div>
          ),
        },
      ];

      if (isCancel) {
        baseColumns.push({
          header: 'Action',
          cell: ({ row }) => (
            <div className='flex items-center gap-2'>
              <Tooltip title='แก้ไขข้อมูล'>
                <IconButton onClick={() => handleEdit(row.original)}>
                  <i data-bs-toggle='modal' className='tabler-edit text-[22px] text-textSecondary' />
                </IconButton>
              </Tooltip>
            </div>
          ),
        });
      }

      return baseColumns;
    },
    [columnHelper, locale, handleEdit, isCancel]
  );
const SuccessTable = ({ tableData, onUpdate ,isSuccess , isCancel }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(tableData);
  const [globalFilter, setGlobalFilter] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpenAddUser, setModalOpenAddUser] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const filteredData = isSuccess ? tableData?.filter((user) => user.attributes.status === 'เสร็จสิ้น') : tableData?.filter((user) => user.attributes.status==='ยกเลิก');
    setData(filteredData);
  }, [tableData]);

  const { lang: locale } = useParams();

  const handleEdit = (data) => {
    setSelectedUser(data);
    setEditDialog(true);
  };

  const handleClose = () => {
    setEditDialog(false);
  };

  const columns = Columns({ columnHelper, locale, handleEdit });

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
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
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

      <EditDialog 
       
        isConfirm = {true}
        open={editDialog}
        onClose={handleClose}
        selectedUser={selectedUser}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default SuccessTable;
