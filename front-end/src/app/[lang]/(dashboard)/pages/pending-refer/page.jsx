'use client'
import React from 'react'
import PendingReferTable from './pending-refer-table'
import axios from 'axios' 
import Loading from '@/views/Loading'
import { Card, Typography, Grid } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { getLocalizedUrl } from '@/utils/i18n'
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

async function fetchUsers(hospitalId, token) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/referList`, {
      headers: {
        Authorization: `${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Fetch users failed:', error)
    throw error
  }
}

const PendingRefer = () => {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const { data: session, status } = useSession();
    const hasFetched = React.useRef(false); // This will track if data has already been fetched
    const router = useRouter()
    const { lang: locale } = useParams()

    const fetchData = async () => {
        if (session && session.user.token && !hasFetched.current) {
            hasFetched.current = true; // Mark that the data has been fetched
            try {
                const data = await fetchUsers(session.user.hospitalId, session.user.token);
                setUsers(data.data);
            } catch (error) {
                if (error.response.data.message === 'Failed to verify token') {
                  toast.warning('Your session has expired')
                  setError(error)
                  await signOut({ redirect: false })
                  router.push(getLocalizedUrl('/login', locale))
                }
            } finally {
                setLoading(false);
            }
        }
    };

    // Define the refreshData function
    const refreshData = async () => {
        setLoading(true); // Optional: set loading to true for better UX
        try {
            const data = await fetchUsers(session.user.hospitalId, session.user.token);
            setUsers(data.data);
           
        } catch (error) {
      
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (status === 'authenticated' && !hasFetched.current) {
            fetchData()
        }
    }, [status, session])

    if (loading)
        return (
            <Card>
                <Loading />
            </Card>
        )
    if (error) return <p>Error: {error.message}</p>

    return (
        <Grid item xs={12} className='space-y-3'>
            <Card className='w-full border-l-8 border-primary'>
                <Typography className='p-2 ml-2 text-primary' variant='h4'>
                    ตอบรับปรึกษา
                </Typography>
            </Card>
            <PendingReferTable tableData={users} refreshData={refreshData} />
        </Grid>
    )
}

export default PendingRefer
