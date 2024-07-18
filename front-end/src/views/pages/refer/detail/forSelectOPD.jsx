'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'
import { Checkbox, FormControlLabel, Grid, TablePagination } from "@mui/material";

// Third-party Imports
import classnames from 'classnames'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getFacetedRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table'

// Component Imports

// import TablePaginationComponent from '@components/TablePaginationComponent'
import TablePaginationComponent from './TablePaginationComponent'


// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { useParams } from 'next/navigation';

const tableData = [
    {
        id: "OPD0001",
        name: "ประสาน ศรีโสภา",
        department: "0001 : แม่และเด็ก",
        createBy: "นายแพทย์ A",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "active"
    },
    {
        id: "OPD0002",
        name: "ประสาน ศรีโสภา",
        department: "0002 : หัวใจ",
        createBy: "นายแพทย์ B",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "active"
    },
    {
        id: "OPD0003",
        name: "ประสาน ศรีโสภา",
        department: "0003 : อายุรกรรม",
        createBy: "นายแพทย์ C",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "inactive"
    },
    {
        id: "OPD0004",
        name: "ประสาน ศรีโสภา",
        department: "0001 : แม่และเด็ก",
        createBy: "นายแพทย์ A",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "active"
    },
    {
        id: "OPD0005",
        name: "ประสาน ศรีโสภา",
        department: "0001 : แม่และเด็ก",
        createBy: "นายแพทย์ A",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "active"
    },
    {
        id: "OPD0006",
        name: "ประสาน ศรีโสภา",
        department: "0001 : แม่และเด็ก",
        createBy: "นายแพทย์ A",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "active"
    },
    {
        id: "OPD0007",
        name: "ประสาน ศรีโสภา",
        department: "0001 : แม่และเด็ก",
        createBy: "นายแพทย์ A",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "inactive"
    },
    {
        id: "OPD0008",
        name: "ประสาน ศรีโสภา",
        department: "0001 : แม่และเด็ก",
        createBy: "นายแพทย์ A",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "active"
    },
    {
        id: "OPD0009",
        name: "ประสาน ศรีโสภา",
        department: "0001 : แม่และเด็ก",
        createBy: "นายแพทย์ A",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "inactive"
    },
    {
        id: "OPD0010",
        name: "ประสาน ศรีโสภา",
        department: "0001 : แม่และเด็ก",
        createBy: "นายแพทย์ A",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "active"
    },
    {
        id: "OPD0011",
        name: "ประสาน ศรีโสภา",
        department: "0001 : แม่และเด็ก",
        createBy: "นายแพทย์ A",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "active"
    },
    {
        id: "OPD0012",
        name: "ประสาน ศรีโสภา",
        department: "0001 : แม่และเด็ก",
        createBy: "นายแพทย์ A",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "inactive"
    },
    {
        id: "OPD0013",
        name: "ประสาน ศรีโสภา",
        department: "0001 : แม่และเด็ก",
        createBy: "นายแพทย์ A",
        type: "OPD",
        createAt: "27/06/2024 16.00",
        status: "active"
    }
];

const columnHelper = createColumnHelper()
const Columns = ({ columnHelper, locale, defaultCheck, page, onPage, handleChange }) => useMemo(() => [
    {
        header: '#',
        accessor: 'rowCount',
        cell: ({ row }) => (
            <div>{row.index + 1}</div>
        )
    },
    {
        id: 'select',
        header: ({ table }) => (
            <>
                {/* <div> */}
                {/* <FormControlLabel
                    control={
                        <Checkbox
                            {...{
                                checked: table.getIsAllRowsSelected(),
                                indeterminate: table.getIsSomeRowsSelected(),
                                onChange: table.getToggleAllRowsSelectedHandler()
                            }}
                        />}
                    label='All'
                    labelPlacement='bottom'
                /> */}
                {Object.keys(onPage).map(key => (
                    page == key &&
                    <div key={key}>
                        <Checkbox
                            checked={onPage[key]}
                            onChange={() => defaultCheck(key)}
                        />
                        Page {key}
                    </div>
                ))}
            </>
        ),
        cell: ({ row }) => (
            <div>
                {/* // <div> */}
                <Checkbox
                    {...{
                        checked: row.getIsSelected(),
                        onChange: handleChange(row)
                    }}
                />
            </div>
        )
    },
    {
        header: 'รหัส',
        cell: ({ row }) => (
            row.original.id
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
        header: 'สร้างเมื่อ',
        cell: ({ row }) => (
            row.original.createAt
        )
    }
], [columnHelper, locale, page, handleChange])

export default function ForSelectOPD({ selectOPD, setSelectOPD }) {
    const [rowSelection, setRowSelection] = useState({})
    const [onPage, setOnPage] = useState({ 1: false })
    const [data, setData] = useState(tableData)
    const [page, setPage] = useState(1)
    const { lang: locale } = useParams()

    const startRow = 10 * (page - 1) + 1
    const lastRow = data.length - (10 * (page)) > 0 ? 10 * (page) : (10 * (page - 1)) + (data.length % (10))


    useEffect(() => {
        setData(tableData)
        let result = Math.ceil(tableData.length / 10);
        const allPage = {};
        for (let i = 2; i <= result; i++) {
            allPage[i] = false;
        }
        const allPagination = { ...onPage, ...allPage };
        setOnPage(allPagination);
        // console.log(allPagination)
        const index = data.map((item, index) => selectOPD.includes(item.id) ? index : -1).filter(index => index !== -1);
        const newRowSelection = { ...rowSelection };
        index.forEach(i => {
            newRowSelection[i] = true;
        });
        setRowSelection(newRowSelection);
        checkSelectAllBtn(newRowSelection, allPagination);
    }, [])


    useEffect(() => {
        setPage(table.getState().pagination.pageIndex + 1);
    }, [getPaginationRowModel()]);

    const checkSelectAllBtn = (newRowSelection, allPagination) => {
        // console.log(allPagination, 'allPagination')
        // console.log(newRowSelection, 'newRowSelection')
        for (let index = 1; index <= Object.keys(allPagination).length; index++) {
            const checkStartRow = 10 * (index - 1) + 1
            const checkLastRow = data.length - (10 * (index)) > 0 ? 10 * (index) : (10 * (index - 1)) + (data.length % (10))
            // console.log(checkStartRow, ' checkStartRow ', checkLastRow, ' checkLastRow ')
            const hasAllKeysTrueFirst = () => {
                for (let i = (checkStartRow - 1); i <= (checkLastRow - 1); i++) {
                    if (!newRowSelection.hasOwnProperty(i)) {
                        return false;
                    }
                }
                return true;
            };
            // console.log(hasAllKeysTrueFirst(), 'hasAllKeysTrueFirst()')
            onPage[index] = hasAllKeysTrueFirst()
            setOnPage(prevState => ({
                ...prevState,
                [index]: hasAllKeysTrueFirst()
            }));
        }
    }

    const handleChange = (row) => (event) => {
        // console.log(row)
        // console.log(row.id)        
        row.getToggleSelectedHandler()(event);
        let id = +row.id +1
        let result = Math.ceil(id / 10);
        // if (row.id == 0) {
        //     result = 1
        // } else if (row.id % 10 == 0) {
        //     result = result + 1
        // }

        if (rowSelection.hasOwnProperty(row.id)) {
            // console.log(`row.id "${row.id}" exists.${result}`)
            onPage[result] = false
            setOnPage(prevState => ({
                ...prevState,
                [result]: false
            }));
        } else {
            // console.log(`row.id "${row.id}" does not exist in the object.`)
            const hasAllKeysTrue = () => {
                for (let i = (startRow - 1); i < (lastRow); i++) {
                    if (i == row.id) {
                        continue; // Skip the key 'except'
                    }
                    if (!rowSelection.hasOwnProperty(i)) {
                        return false;
                    }
                }
                return true;
            };
            onPage[result] = hasAllKeysTrue()
            setOnPage(prevState => ({
                ...prevState,
                [result]: hasAllKeysTrue()
            }));
        }
        // setOnPage(prevState => ({
        //     ...prevState,
        //     [result]: onPage[result]
        // }));
    };
    // console.log(rowSelection)
    const defaultCheck = (key) => {

        if (!onPage[key]) {
            const newSelection = {};
            for (let i = startRow - 1; i <= lastRow - 1; i++) {
                newSelection[i] = true;
            }
            const mergedSelection = { ...rowSelection, ...newSelection };
            setRowSelection(mergedSelection);
            onPage[key] = !onPage[key]
            // console.log(mergedSelection)
        } else {
            const newSelection = rowSelection
            for (let i = startRow - 1; i <= lastRow - 1; i++) {
                delete newSelection[i];
            }
            setRowSelection(newSelection)
            onPage[key] = !onPage[key]
        }
        setOnPage(prevState => ({
            ...prevState,
            [key]: onPage[key]
        }));
    }

    const columns = Columns({ columnHelper, locale, defaultCheck, page, onPage, handleChange })

    const table = useReactTable({
        data,
        columns,
        state: { rowSelection },
        initialState: { pagination: { pageSize: 10 } },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel()
    });

    const selectedData = useMemo(() => data.filter((_, index) => rowSelection[index]));

    // console.log(selectedData)

    useEffect(() => {
        const rememberOPD = selectedData.map(item => item.id)
        console.log(selectedData.map(item => item.id))
        setSelectOPD(rememberOPD)

    }, [selectedData.length]);
    
    return (
        <Grid container spacing={4}>
            <Grid item xs={12} style={{ overflow: 'auto' }}>
                {selectedData.length > 0 && 'รหัส OPD ที่เลือก : '}
                {
                    selectedData.map(item => (
                        item.id + ' '
                    ))
                }<br/><br/>
                <TablePagination
                    component={() => <TablePaginationComponent table={table} />}
                    count={table.getFilteredRowModel().rows.length}
                    rowsPerPage={table.getState().pagination.pageSize}
                    page={table.getState().pagination.pageIndex}
                    onPageChange={(_, page) => {
                        table.setPageIndex(page);
                    }}
                />

                <div className='overflow-x-auto mt-2'>
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
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
                {/* <TablePagination
                    component={() => <TablePaginationComponent table={table} />}
                    count={table.getFilteredRowModel().rows.length}
                    rowsPerPage={table.getState().pagination.pageSize}
                    page={table.getState().pagination.pageIndex}
                    onPageChange={(_, page) => {
                        table.setPageIndex(page);
                    }}
                /> */}
            </Grid>
        </Grid>
    )
}