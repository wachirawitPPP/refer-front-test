'use client'
import { Grid, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import UserSettingTable from '@/views/apps/setting/user/UserSettingTable';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import DataNotFound from '@/views/DataNotFound';
import Loading from '@/views/Loading';

const fetchDepartment = async (token, hospitalId) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/department-by-id/${hospitalId}`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch department data:', error);
    throw new Error('Failed to fetch department data');
  }
};

const fetchData = async (token, hospitalId) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_TEST_API_URL}/hospital-user`, { hospitalId }, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw new Error('Failed to fetch user data');
  }
};

const ReferList1 = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState([]);
  const [department, setDepartment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    if (session && session.user.token) {
      try {
        setLoading(true);
        const [userData, departmentData] = await Promise.all([
          fetchData(session.user.token, session.user.hospitalId),
          fetchDepartment(session.user.token, session.user.hospitalId)
        ]);
        setData(userData);
        setDepartment(departmentData);
        setError(null); // clear any previous errors
      } catch (error) {
        setError(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      getData();
    }
  }, [status, session]);

  if (loading) return <Loading/>;
  if (error) return <DataNotFound/>;

  return (
    <Grid item xs={12}>
      <UserSettingTable tableData={data.data} department={department} onUpdate={getData} />
    </Grid>
  );
};

export default ReferList1;
