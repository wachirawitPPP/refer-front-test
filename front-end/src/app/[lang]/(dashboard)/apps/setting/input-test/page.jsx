// UserListApp.js

import React from 'react';
import Grid from '@mui/material/Grid';
import IcdSearch from './Test';
import axios from 'axios';

const getData = async () => {
    const res = await fetch(`${process.env.API_URL}/apps/address`);
    if (!res.ok) {
      throw new Error('Failed to fetch address data');
    }
    
    return res.json();
  };

  // const getIcd = async () => {
  //   axios.post(`${process.env.API_URL}/apps/icd`, { query: 'T' }, {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //     .then(response => console.log(response.data))
  //     .catch(error => console.error('Error:', error));
  // }
  
  const UserListApp  = async () => {
    // const data =  await getData();
    // const icd = await getIcd();
    
  
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
           <IcdSearch/>
          </Grid>
        </Grid>
      </div>
    );
  };
  
  export default UserListApp;