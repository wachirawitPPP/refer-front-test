import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  Typography,
  Chip,
  IconButton,
  styled,
  TablePagination,
  Tooltip,
  MenuItem,
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
import TablePaginationComponent from '@components/TablePaginationComponent';
import CustomTextField from '@core/components/mui/TextField';
import CustomAvatar from '@core/components/mui/Avatar';
import tableStyles from '@core/styles/table.module.css';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import TableFilters from './refer-table-filter';
import DataNotFound from '@/views/DataNotFound';




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
  0: 'secondary',
  1: 'warning',
  2: 'error',
};

const statusObj = {
  1: 'warning',
  2: 'info', 
}

const getAvatar = ({ avatar }) => {
  if (avatar) {
    return <CustomAvatar src={avatar} size={34} />;
  }
};

const fotmatDate = (string) => {
  if (string != null) {
    let year = string.substring(0, 4);
    let sumYear = year.substring(0, 10);
    let mount = string.substring(5, 7);
    let day = string.substring(8, 10);
    const time = new Date(string).toLocaleString("th-TH").substring(9, 15);
    var months_th_mini = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "12",
      "12",
    ];
    let date =
      sumYear + "-" + months_th_mini[mount - 1] + "-" + day + " " + time;
    return date;
  } else {
    return string;
  }
};

const Columns = ({ columnHelper, locale, handleEdit }) =>
  useMemo(
    () => [
      {
        header: 'id',
        cell: ({ row }) => row.original.id,
      },
      columnHelper.accessor('name', {
        header: 'ชื่อ-นามสกุล',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* {getAvatar({ avatar: row.original.attributes.images })} */}
            <div className='flex flex-col'>
              <Link href={`refer-detail/${row.original.id}`}>
                <Typography color='text.primary' className='font-medium'>
                 {row.original.name}
                </Typography>
                <Typography className='font-small'>{row.original.Hospital?.HNCode}{row.original.hn}</Typography>
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
              label={
                row.original.urgent === 0 ? 'elective' :
                  row.original.urgent === 1 ? 'urgency' :
                    row.original.urgent === 2 ? 'emergency' :
                      ''
              }
              color={userStatusObj[row.original.urgent]}
              size='small'
            />
          </div>
        ),
      },
      {
        header: 'แผนก/หน่วยงาน',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>{row.original.department}</div>
        ),
      },
      {
        header: 'โรงพยาบาลต้นทาง',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>{row.original.Hospital.name}</div>
        ),
      },  
      {
        header: 'แพทย์ส่งตัว',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>{row.original.refer_by}</div>
        ),
      },
      {
        header: 'โรงพยาบาลปลายทาง',
        cell: ({ row }) => (  
            <div className='flex items-center gap-4'>{row.original.Destination_hospital?.name}</div>
        ), 
      },
      {
        header: 'วันที่สร้างรายการ',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>{fotmatDate(row.original.referDate)}</div>
        ),
      },
      {
        header: 'สถานะ',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              variant='tonal'
              className='capitalize'
              label={row.original.status == 1 ? "รอการยืนยัน" :row.original.status == 2? "รับเข้ารักษา" : ""}
              color={statusObj[row.original.status]}
              size='small'
            />
          </div>
        ),
      },
      {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Link href={`refer-detail/${row.original.id}`}>
              <Tooltip title="ดูข้อมูล">
                <IconButton>
                  <i data-bs-toggle="modal" className='tabler-eye text-[22px] text-textSecondary' />
                </IconButton>
              </Tooltip>
            </Link>
          </div>
        ),
      },
    ],
    [columnHelper, locale]
  );

const Recieve = ({ tableData, onUpdate }) => {
  

  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(tableData);
  const [globalFilter, setGlobalFilter] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpenAddUser, setModalOpenAddUser] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const {data : session } =  useSession();
  const [filterData, setFilterData] = useState([])

  useEffect(() => {
    const filteredData = tableData?.filter((user) => user.dest_hospital_id === session?.user?.hospitalId  &&  user.status === "2"  );
    setData(filteredData);
    setFilterData(filteredData);
}, [tableData,session]);

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

    <div className="w-full flex flex-col">
      <TableFilters setData={setData} tableData={filterData} />
    </div>

    <div className='overflow-x-auto min-h-[300px]'>

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
                <DataNotFound />
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
    <div className='flex flex-row'>

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
  {/* <EditDialog 
   
   isEdit={true}
   open={editDialog}
   onClose={handleClose}
   selectedUser={selectedUser}
   onUpdate={onUpdate}
 /> */}
</>
  );
};

export default Recieve;
