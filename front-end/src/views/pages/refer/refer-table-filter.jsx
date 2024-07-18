// React Imports
import { useState, useEffect } from 'react';

// MUI Imports
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

// Component Imports
import CustomTextField from '@core/components/mui/TextField';

const TableFilters = ({ setData, tableData }) => {
  // States
  const [urgent, setUrgent] = useState('');

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (urgent === '') return true; // Show all users if no filter is applied
      return user.attributes.urgent === urgent; // Compare with string value
    });

    setData(filteredData);
  }, [urgent, tableData, setData]);

  const resetFilters = () => {
    setUrgent('');
    setData(tableData);
  };

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={3}>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={urgent}
            onChange={e => setUrgent(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>เลือกความเร่งด่วน</MenuItem>
            <MenuItem value='Emergency'>Emergency</MenuItem>
            <MenuItem value='Urgent'>Urgent</MenuItem>
            <MenuItem value='Elective'>Elective</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" size='md' color="primary" onClick={resetFilters}>
            <i className='tabler-refresh' />
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TableFilters;
