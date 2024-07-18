'use client'
// MUI Imports
import { Grid, Typography, CircularProgress, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import UserDetails from '../UserDetails';
import UserHistoryTable from '../UserHistoryTable';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const getData = async (id, token) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TEST_API_URL}/customer/${id}`, {
      headers: {
        'Authorization': `${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const ReferList1 = () => {
  const { id } = useParams(); 
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  const refreshData = async () => {
    if (session && session.user.token) {
      try {
        const newData = await getData(id, session.user.token);
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
  }, [status, session, id]);

  if (status === 'loading' || !data) return <CircularProgress />;  // Show loading spinner while data is loading
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Grid item xs={12} className='space-y-3'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h5'>
          รายละเอียด: {data.user.firstnameTH} {data.user.lastnameTH} ({data.user.hn})
        </Typography>
        {/* <Button onClick={refreshData} variant='contained' color='primary'>Refresh Data</Button> */}
      </div>
      <UserDetails user={data.user}/>
      <UserHistoryTable tableData={[]} user={data.user} />
    </Grid>
  );
};

export default ReferList1;
