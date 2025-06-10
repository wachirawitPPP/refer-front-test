'use client'
import * as React from 'react'
import PropTypes from 'prop-types'
import { Card, Tabs, Tab, Box, Typography, Skeleton, Button } from '@mui/material'

// Internal imports
import ReferTable from '@/views/pages/refer/refer-table'
import RecieveTable from '@/views/pages/refer/recieve-table'
import StatusTable from '@/views/pages/refer/ststus-table'
import Loading from '@/views/Loading'
import AddReferModal from './Add-Refer-Modal'
import axios from 'axios'
import { getLocalizedUrl } from '@/utils/i18n'
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation'

async function fetchUsers(token) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/referList`, {
      headers: {
        Authorization: `${token}`
      }
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Fetch users failed:', error)
    throw error
  }
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0)
  const [users, setUsers] = React.useState([])
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const { data: session, status } = useSession()
  const hasFetched = React.useRef(false)
  const [addModal, setAddModal] = React.useState(false)
  const router = useRouter()
  const { lang: locale } = useParams()
  
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const fetchData = async () => {
    if (session && session.user.token) {
      hasFetched.current = true
      try {
        const data = await fetchUsers(session.user.token)
        setUsers(data.data)
      } catch (error) {
        setError(error)
        toast.warning("Your session has expired")
        setError(error);
        await signOut({ redirect: false })
        router.push(getLocalizedUrl('/login', locale))
      } finally {
        setLoading(false)
      }
    } else {
      setError(error)
    }
  }

  React.useEffect(() => {
    if (status === 'authenticated' && !hasFetched.current) {
      fetchData()
    }
  }, [status, session])

  if (loading) {
    return (
      <Card>
        <Loading />
      </Card>
    )
  }

  const OpenModalAddRefer = ()=>{
    setAddModal(true)
  }

  // const filterStatus = async (status) => {

  // }

  return (
    <Card>
      <Tabs value={value} onChange={handleChange} aria-label='basic tabs example' className='m-4 '>
        <Tab label='รายการส่งตัว' {...a11yProps(0)} />
        {/* <Tab label='รายการรับตัว' {...a11yProps(1)} /> */}
        {/* <Tab label='เสร็จสิ้น' {...a11yProps(1)} />
        <Tab label='ยกเลิก' {...a11yProps(2)} /> */}

        {/* <div className="w-full flex justify-end my-2">
            <Button
              color="primary"
              variant="tonal"
              startIcon={<i className='tabler-plus' />}
              onClick={OpenModalAddRefer}
            >
              ส่งปรึกษา
            </Button>
          </div> */}
      </Tabs>
      <AddReferModal 
       open={addModal}
       onClose={() => setAddModal(false)}
      />

      <CustomTabPanel value={value} index={0}>
        <ReferTable tableData={users} onUpdate={fetchData} />
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={1}>
        <RecieveTable tableData={users} onUpdate={fetchData} />
      </CustomTabPanel> */}
      <CustomTabPanel value={value} index={1}>
        <StatusTable tableData={users} isSuccess={true} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <StatusTable tableData={users} isCancel={true} />
      </CustomTabPanel>
    </Card>
  )
}
