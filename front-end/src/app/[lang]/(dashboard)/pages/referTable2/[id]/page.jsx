'use client'
// MUI Imports
import { Grid, Typography, CircularProgress, Button, Card, Tooltip, Chip } from '@mui/material'
import { useEffect, useState } from 'react'
import UserDetails from '../UserDetails'
// import UserHistoryTable from '../UserHistoryTable';
import OpdTable from '../opd_component/opd-list-component'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Loading from '@/views/Loading'

const getData = async (id, token) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TEST_API_URL}/customer/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }

    return await res.json()
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

const getHospitalList = async token => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/hospital`, {
      headers: {
        Authorization: `${token}`
      }
    })
    return response.data.data
  } catch (error) {
    console.error(error)
  }
}

const DataAPIEphis = async (id_card, token) => {
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

// const getPatient = async (token, PatientId) => {
//   try {
//     const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/apiEphis/login`, {
//       headers: {
//         Authorization: `${token}`
//       }
//     })

//     const token2 = response.data.data.token
//     const response2 = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/GetPattient`, {
//       headers: {
//         Authorization: `${token2}`
//       },
//       params: {
//         idcard: PatientId
//       }
//     })
//     return response2.data.Result[0]
//   } catch (error) {
//     console.error(error)
//     return 'Error fetching patient data'
//   }
// }
const getPatient = async (token, PatientId) => {
  // Validate input
  if (!token || !PatientId) {
    console.error('Missing required parameters')
    return null
  }

  try {
    // Get ephis token
    const loginResponse = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/apiEphis/login`, {
      headers: {
        Authorization: `${token}`
      }
    })

    if (!loginResponse.data?.data?.token) {
      throw new Error('Failed to get ephis token')
    }

    const token2 = loginResponse.data.data.token

    // Get patient data with retry logic
    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      try {
        const response2 = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/GetPattient`, {
          headers: {
            Authorization: `${token2}`
          },
          params: {
            idcard: PatientId
          }
        })

        if (response2.data?.Result?.[0]) {
          return response2.data.Result[0]
        }
        throw new Error('Invalid response format')
      } catch (fetchError) {
        retryCount++
        if (retryCount === maxRetries) throw fetchError
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  } catch (error) {
    console.error('getPatient error:', error.message)
    return null // Return null instead of error string for consistency
  }
}

const getPatientByIdcard = async (token, idcard) => {
  try {
    const response2 = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/customer-idcard/${idcard}`, {
      headers: {
        Authorization: `${token}`
      }
    })
    return response2.data.user
  } catch (error) {
    console.error(error)
    return 'Error fetching patient data'
  }
}

const ReferList1 = () => {
  const { id } = useParams()
  const params = useSearchParams()
  const [data, setData] = useState(null)
  const [dataOpds, setDataOpds] = useState(null)
  const [hnPrefix, setHnPrefix] = useState(null)
  const [hospitalList, setHospitalList] = useState(null)
  const [error, setError] = useState(null)
  const { data: session, status } = useSession()

  const [ptdata, setPtdata] = useState(null)
  const [patientDataByidCard, setPatientDataByidCard] = useState(null)
  const router = useRouter()

  const refreshData = async () => {
    console.log(session.user.exp)

    const id_card_query = params.get('id_card')

    console.log(id_card_query)

    if (session && session.user.token) {
      try {
        const hospital = await getHospitalList(session.user.token)
        const newData = await getData(id, session.user.token)
        const DataOpd = await DataAPIEphis(params.get('id_card'), session.user.token)
        const getPrefix = await getHnPrefix(session.user.token, session.user.hospitalId)
        console.log('DataOpd', DataOpd)
        //console.log("newData",newData)

        const pt_data = await getPatient(session.user.token, params.get('id_card'))
        const pt_data_idcard = await getPatientByIdcard(session.user.token, params.get('id_card'))
        if (params.get('id_card')) {
          setPtdata(pt_data)
        }
        if (pt_data_idcard) {
          setPtdata(pt_data)
          console.log('pt_data_idcard', pt_data_idcard)
          setPatientDataByidCard(pt_data_idcard)
        }
        if (newData && DataOpd && getHnPrefix && hospital) {
          setHospitalList(hospital)
          setData(newData)
          setDataOpds(DataOpd)
          setHnPrefix(getPrefix)

          setError(null)
        } else {
          setError('No data available')
        }
      } catch (error) {
        setError('Failed to fetch data')
      }
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      refreshData()
    }
  }, [status, session, id])

  if (status === 'loading' || !data) {
    return (
      <Card>
        <Loading />
      </Card>
    ) // Show loading spinner while data is loading
  }

  if (error) return <Typography>Error: {error}</Typography>

  return (
    <Grid item xs={12} className='space-y-3'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* <Typography variant='h5'>
          รายละเอียด: {data.user.firstnameTH} {data.user.lastnameTH} ({hnPrefix+data.user.hn})
        </Typography> */}
        {/* <Button onClick={refreshData} variant='contained' color='primary'>Refresh Data</Button> */}
      </div>
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
      {/* <UserDetails user={data.user} hnPrefix={hnPrefix} /> */}
      <UserDetails patientData={ptdata} pt_data_idcacrd={patientDataByidCard} dataOpds={dataOpds} />
      <OpdTable dataOpds={dataOpds} loading={false} user={data.user} hospitalList={hospitalList} />
      {/* <UserHistoryTable tableData={dataOpds.opd} user={data.user} />   */}
    </Grid>
  )
}

export default ReferList1
