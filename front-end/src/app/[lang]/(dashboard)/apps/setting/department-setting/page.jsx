'use client'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Grid from '@mui/material/Grid';
import DepartmentTable from '@/views/apps/setting/department/DepartmentTable';
import { useState, useEffect } from 'react';

const getData = async (hospitalId,token) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_TEST_API_URL}/department-by-id/${hospitalId}`, {
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
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const refreshData = async () => {
    if (session && session.user.token) {
      try {
        const newData = await getData(session.user.hospitalId,session.user.token);
        if (newData) {
          setData(newData);
          setError(null); // clear any previous errors
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

  return (
    <Grid item xs={12}>
      {error ? (
        <div>{error}</div>
      ) : data ? (
        <DepartmentTable tableData={data.departments} onUpdate={refreshData} />
      ) : (
        <div>Loading...</div>
      )}
    </Grid>
  );
};

export default ReferList1;
