'use client'
// MUI Imports
import { Grid, Typography, CircularProgress, Button, Card, Chip, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import ReferUserDetails from '../refer-user-details'
// import ReferOpdLists from '../refer-opd-lists'
import OpdTable from '../opd-user-rq/opd-list-component'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Loading from '@/views/Loading'
import { getLocalizedUrl } from '@/utils/i18n'
import { signOut } from 'next-auth/react'
import { toast } from 'react-toastify'
const getHospitalList = async token => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/hospital`, {
      headers: {
        Authorization: `${token}`
      }
    })
    // console.log(res.data.data)
    return res.data.data
  } catch (error) {
    console.error(error)
    return null
  }
}
const DataAPIEphis = async (token, id_card) => {
  //id_card = '3100900374300'

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/apiEphis/login`, {
      headers: {
        Authorization: `${token}`
      }
    })

    const token2 = response.data.data.token
    const response1 = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/OPD_erfer`, {
      headers: {
        Authorization: `${token2}`
      },
      params: {
        idcard: id_card
      }
    })
    return response1.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const getDataOpds = async (id, token) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/referList/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })

    // console.log("res",res.data.data[0])
    return res.data.data[0]
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

const getHnPrefix = async (token, hospitalId) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/hospital-info/${hospitalId}`, {
      headers: {
        Authorization: `${token}`
      }
    })
    return res.data.data.HNCode
  } catch (error) {
    console.error(error)
    return 'Error generating HN'
  }
}

const ReferDetails = () => {
  const { id } = useParams()
  const params = useSearchParams()
  const [data, setData] = useState(null)
  const [dataRefer, setDataOpds] = useState([])
  const [hnPrefix, setHnPrefix] = useState(null)
  const [error, setError] = useState(null)
  const { data: session, status } = useSession()
  const [hospitalList, setHospitalList] = useState([])
  const router = useRouter()
  const [ephisData, setEphisData] = useState([])
  const [ptDataIdcard, setPtDataIdcard] = useState([]) 
  const { lang: locale } = useParams()
  const refreshData = async () => {
    const id_card = params.get('id_card')
    // console.log(session.user.exp)
    try {
      const getCustomer = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/customer-idcard/${id_card}`, {
        headers: {
          Authorization: `${session.user?.token}`
        }
      })
      if (session && session.user.token) {
        try {
          const ephisOpd = await DataAPIEphis(session.user.token, params.get('id_card'))
          const getHospital = await getHospitalList(session.user.token)
          const DataOpd = await getDataOpds(id, session.user.token)
          // const DataOpd = await getDataOpds(id,session.user.token)
          const getPrefix = await getHnPrefix(session.user.token, session.user.hospitalId)
          // console.log("DataOpd",DataOpd)
          //console.log("newData",newData)
          setDataOpds(DataOpd)
          setPtDataIdcard(getCustomer.data.user)
          setData(DataOpd)
          setHospitalList(getHospital)
          setHnPrefix(getPrefix)
          if (ephisOpd.length > 0) {
            setEphisData(ephisOpd)
            setError(null)
          }
        } catch (error) {
          console.log(response.status)
          setError('Failed to fetch data')
        }
      }
    } catch (err) {
      if (err.response.data.message === 'Failed to verify token') {
        toast.warning('Your session has expired')
        setError(error)
        await signOut({ redirect: false })
        router.push(getLocalizedUrl('/login', locale))
      }
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      refreshData()
    }
  }, [status, session, id])

  // useEffect(() => {
  //   console.log("Updated hospitalList:", hospitalList);
  // }, [hospitalList]);

  if (status === 'loading' || !data || !dataRefer) return <Loading /> // Show loading spinner while data is loading
  if (error) return <Typography>Error: {error}</Typography>

  return (
    <Grid item xs={12} className='space-y-3'>
      <Typography variant='h5' className='mb-2 '>
        <div className='flex-row flex'>
          <Tooltip title='ย้อนกลับ' onClick={() => router.back()}>
            <Chip
              color='primary'
              label={
                <>
                  <div className='flex flex-row'>
                    <i className='tabler-arrow-back '></i>
                    <span className='my-1'>ย้อนกลับ</span>
                  </div>
                </>
              }
            />
          </Tooltip>
        </div>
      </Typography>
      <Card className='w-full border-l-8 border-primary'>
        <Typography className='p-2 ml-2 text-primary' variant='h4'>
          รายละเอียดคนไข้
        </Typography>
      </Card>
      {/* <Button onClick={refreshData} variant='contained' color='primary'>Refresh Data</Button> */}

      <ReferUserDetails
        user={data.Customer}
        ptDataIdcard={ptDataIdcard}
        hospitalList={hospitalList}
        hnPrefix={hnPrefix}
        dataOpds={ephisData}
      />
      {/* <ReferOpdLists  tableData={dataOpds} referDetail={data} hospitalList={hospitalList} refreshData={refreshData} /> */}
      <OpdTable
        dataOpds={ephisData}
        referDetails={data || []}
        dataRefer={dataRefer || []}
        loading={false}
        hospitalList={hospitalList}
        refer={params.get('refer')}
      />
    </Grid>
  )
}

export default ReferDetails
