'use client'
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useSession } from 'next-auth/react';

// Component Imports
import HospitalForms from '@/views/apps/setting/hospital/hospital-forms';

const fetchData = async (token,id) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/hospital-info/${id}`,{
      headers: {
        'Authorization': `${token}`
      }
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw new Error('Failed to fetch userData');
  }
};

const FormLayouts = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  useEffect(() => {
    
    if (status === 'authenticated') {
      const getData = async () => {
        if(session && session.user.token){
          try {
            const result = await fetchData(session.user?.token,session.user?.hospitalId);
            setData(result);
            console.log(result);
          } catch (error) {
            setError(error.message);
            console.log(error)
          } finally {
            setLoading(false);
          }
        }
        
      };
      getData();
    }
    
  }, [status, session]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <HospitalForms data={data.data} />
      </Grid>
    </Grid>
  );
};

export default FormLayouts;
