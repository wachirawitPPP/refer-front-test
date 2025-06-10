'use client'
// MUI Imports
import { Grid, Typography, CircularProgress, Skeleton, Card } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import UserTable from './UserTable';
import { signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import Loading from '@/views/Loading'; 
import { useParams, useRouter } from 'next/navigation'
import { getLocalizedUrl } from '@/utils/i18n'

const getData = async (hospitalId, token) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/hospital-customer/${hospitalId}`, {
      headers: {
        'Authorization': `${token}`
      }
    });

    return res.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const getHnPrefix = async (token, hospitalId) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/hospital-info/${hospitalId}`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    
    return res.data.data.HNCode;
  } catch (error) {
    console.error(error);
    SesionExpireLout()
    return 'Error generating HN';
  }
};

const ReferList1 = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const [hnPrefix, setHnPrefix] = useState(null);
  const hasFetched = useRef(false);
  const router = useRouter()
  const { lang: locale } = useParams() 


  const SesionExpireLout = async ()=> {
    await signOut({ redirect: false })
    console.log("tokenExpiryTime", tokenExpiryTime)
    // Redirect to login page
    router.push(getLocalizedUrl('/login', locale))
  }
  const tokenExpiryTime_ = Date.now() + 3 * 1000;
  console.log(tokenExpiryTime_)
  console.log(session)

  // if(Date.now() >= getItem.timestamp){
  //   SesionExpireLout()
  //   console.log("Expiire")
  // }

  const refreshData = async () => {
    if (session && session.user.token ) {
      hasFetched.current = true;
      try {
        const newData = await getData(session.user.hospitalId, session.user.token);
        if (newData) {
          setData(newData);
          setError(null);
        } else {
          setError('No data available');
        }
      } catch (error) {
        setError('Failed to fetch data');

        console.log("Tester")
      }
      try {
        const prefix = await getHnPrefix(session.user.token, session.user.hospitalId);
        setHnPrefix(prefix);
        console.log(prefix);
       
      } catch (error) {
        console.log(error);
        await signOut({ redirect: false })
        router.push(getLocalizedUrl('/login', locale))
      }
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && !hasFetched.current) {
      refreshData();
    }
  }, [status, session]);

  if (status === 'loading' || !data) {
    return (
      <Card>
        <Loading/>
        </Card>
     
    );
  }

  if (error) return <UserTable tableData={[]} onUpdate={refreshData} />;

  return (
    <Grid item xs={12}>
      <UserTable tableData={data.user} onUpdate={refreshData} hnPrefix={hnPrefix} userSession = {session?.user} />
    </Grid>
  );
};

export default ReferList1;
