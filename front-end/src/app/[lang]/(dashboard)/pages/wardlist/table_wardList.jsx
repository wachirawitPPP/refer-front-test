import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import axios from 'axios'
import { useSession } from 'next-auth/react'
 

const formatAge = ageString => {
  if (!ageString) return ''

  const [years, months, days] = ageString.split('-')
  return `${years}ปี-${months}เดือน-${days}วัน`
}
const columns = [
  { id: 'ward', label: 'Ward', minWidth: 100 },
  { id: 'wardname', label: 'Ward Name', minWidth: 170 },
  { id: 'room', label: 'Room', minWidth: 100 },
  { id: 'bedno', label: 'Bed No.', minWidth: 100 },
  {
    id: 'bed_status',
    label: 'Bed Status',
    minWidth: 100,
    format: row =>
      row.HN === null ? <span className='text-green-500'>ว่าง</span> : <span className='text-red-500'>ไม่ว่าง</span>
  },
  { id: 'HN', label: 'HN', minWidth: 120 },
  { id: 'AN', label: 'AN', minWidth: 120 },
  {
    id: 'fullName',
    label: 'Patient Name',
    minWidth: 200,
    format: row => (row.name && row.surname !== null ? `${row.name} ${row.surname}` : '')
  },
  { id: 'age', label: 'Age', minWidth: 100, format: row => (row.age !== null ? formatAge(row.age) : '') }
]

const TableWardLists = (ward_code) =>{
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [wardList, setWardList] = useState([])
  const { data: session, status } = useSession()
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  React.useEffect(() => { 
    const fetchData = async (param) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/GetWard`, {
          params: {
            ward: param
          },
          headers: {
            Authorization: `${session?.user?.token}`
          }
        })
        console.log("response table ward list", response) 
        if (response.data.message === 'Success') {
          setWardList(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching ward list data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData(ward_code.ward_code)
  }, [])

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {wardList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                {columns.map(column => {
                  const value = column.format ? column.format(row) : row[column.id]
                  return <TableCell key={column.id}>{value}</TableCell>
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={wardList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
export default TableWardLists