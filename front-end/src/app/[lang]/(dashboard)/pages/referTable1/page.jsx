'use client'
// MUI Imports
import { Grid, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import UserTable from './UserTable';
import { useSession } from 'next-auth/react';

const getData = async (hospitalId,token) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TEST_API_URL}/hospital-customer/${hospitalId}`, {
      headers: {
        'Authorization': `${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const ReferList1 = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  const refreshData = async () => {
    if (session && session.user.token) {
      try {
        const newData = await getData(session.user.hospitalId,session.user.token);
        if (newData) {
          setData(newData);
          setError(null);
        } else {
          setError('No data available');
        }
      } catch (error) {
        setError('Failed to fetch data');
      }
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      refreshData();
    }
  }, [status, session]);

  if (status === 'loading' || !data) return <CircularProgress />;  // Show loading spinner while data is loading
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Grid item xs={12}>
      <UserTable tableData={data.user} onUpdate={refreshData} />
    </Grid>
  );
};

export default ReferList1;
