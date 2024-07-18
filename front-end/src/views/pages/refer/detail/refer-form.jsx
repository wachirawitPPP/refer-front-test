import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';
import { Card, Grid, MenuItem } from '@mui/material';
import CustomTextField from '@core/components/mui/TextField';
import React from 'react';
import CustomAutocomplete from '@core/components/mui/Autocomplete';

const ReferForm = ({ selectedUser, formData, setFormData , isConfirm }) => {
  const wrapperStyle = {
    overflowY: 'auto', // Allows scrolling if content overflows
    padding: '16px',
    margin: '1px',
    // Optional: Add some padding
  };

  const hospitals = ['Hospital A', 'Hospital B', 'Hospital C'];
  const departments = ['Department A', 'Department B', 'Department C'];
  const users = ['User A', 'User B', 'User C'];

  return (
    <Grid container spacing={8}>
      <Grid item xs={12} sm={12} lg={6}>
        <CustomTextField
          disabled
          fullWidth
          label='ชื่อ-สกุล'
          placeholder='ชื่อ-สกุล'
          value={formData.name}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={6}>
        <CustomTextField
          fullWidth
          disabled
          label='HN Code'
          placeholder='HN Code'
          value={formData.hn}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <CustomAutocomplete
        disabled={isConfirm}
          fullWidth
          options={hospitals}
          value={formData.destinationHospital}
          onChange={(event, newValue) => setFormData({ ...formData, destinationHospital: newValue })}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => <CustomTextField {...params} label='โรงพยาบาลปลายทาง' />}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <CustomAutocomplete
        disabled={isConfirm}
          fullWidth
          options={departments}
          value={formData.department}
          onChange={(event, newValue) => setFormData({ ...formData, department: newValue })}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => <CustomTextField {...params} label='แผนก/หน่วยงาน' />}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <CustomAutocomplete
        disabled={isConfirm}
          fullWidth
          options={users}
          value={formData.createBy}
          onChange={(event, newValue) => setFormData({ ...formData, createBy: newValue })}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => <CustomTextField {...params} label='แพทย์ผู้ทำรายการ' />}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <CustomTextField
          disabled={isConfirm}
          select
          fullWidth
          label='ความเร่งด่วน'
          value={formData.urgent}
          onChange={(e) => setFormData({ ...formData, urgent: e.target.value })}
        >
          <MenuItem className='text-error' value='Emergency'>Emergency</MenuItem>
          <MenuItem className='text-warning' value='Urgency'>Urgency</MenuItem>
          <MenuItem className='text-secondary' value='Elective'>Elective</MenuItem>
        </CustomTextField>
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <AppReactDatepicker
        
          disabled={isConfirm}
          id='refer-date'
          dateFormat='dd/MM/yyyy'
          placeholderText='วันที่สร้างรายการ'
          selected={new Date(formData.createDate)}
          onChange={(date) => setFormData({ ...formData, createDate: date })}
          customInput={<CustomTextField label='วันที่สร้างรายการ' fullWidth />}
          maxDate={new Date()}
        />
      </Grid>
      {isConfirm &&(
         <Grid item xs={12} sm={12} lg={4}>
         <AppReactDatepicker
           id='refer-date'
           dateFormat='dd/MM/yyyy'
           placeholderText='วันที่สร้างรายการ'
           selected={new Date(formData.confirmDate)}
           onChange={(date) => setFormData({ ...formData, confirmDate: date })}
           customInput={<CustomTextField label='วันที่รับรายการ' fullWidth />}
           maxDate={new Date()}
         />
       </Grid>
      )

      }
      
    </Grid>
  );
};

export default ReferForm;
