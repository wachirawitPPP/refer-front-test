'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import GeneralData from './detail/general-data'
import OpdTable from './detail/opd-list-component' // Import the new OpdTable component
import FileScan from './detail/opd-component/file-scan' // Import the new OpdTable component
import { Card, Typography } from '@mui/material'

export default function CollapsibleTable() {
  const { id } = useParams()
  const [dataOpds, setDataOpds] = useState([])
  const [patientData, setPatientData] = useState(null)
  const [patientDataByidCard, setPatientDataByidCard] = useState(null)
  const [hospitalList, setHospitalList] = useState(null)
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()

  const DataAPIEphis = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/apiEphis/login`, {
        headers: {
          Authorization: `${session.user?.token}`
        }
      })

      const token2 = response.data.data.token
      const response1 = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/OPD_erfer`, {
        headers: {
          Authorization: `${token2}`
        },
        params: {
          idcard: id
        }
      })
      const response2 = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/GetPattient`, {
        headers: {
          Authorization: `${token2}`
        },
        params: {
          idcard: id
        }
      })

      const getCustomer = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/customer-idcard/${id}`, {
        headers: {
          Authorization: `${session.user?.token}`
        }
      })
      console.log('test', response1.data)

      const getHospitalList = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/hospital`, {
        headers: {
          Authorization: `${session.user?.token}`
        }
      })
      setHospitalList(getHospitalList.data.data)
      if (response2.data.Result.length > 0) {
        setDataOpds(response1.data)
        setPatientData(response2.data.Result[0])
        
      } else {
        setPatientDataByidCard(getCustomer.data.user)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      DataAPIEphis()
    }
  }, [status])

  return (
    <>
      <Card className='w-full border-l-8 border-primary'>
        <Typography className='p-2 ml-2 text-primary' variant='h4'>
          รายละเอียดการส่งตัว
        </Typography>
      </Card>
      <GeneralData
        patientData={patientData}
        pt_data_idcacrd={patientDataByidCard}
        dataOpds={dataOpds}
        loading={loading}
      />
      <OpdTable dataOpds={dataOpds} loading={loading} patientData={patientData} hospitalList={hospitalList} />{' '}
      {/* Pass dataOpds and loading to OpdTable */}
    </>
  )
}
