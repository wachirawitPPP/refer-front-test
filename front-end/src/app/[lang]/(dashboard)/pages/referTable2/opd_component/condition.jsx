import CustomTextField from '@/@core/components/mui/TextField';
import { Grid } from '@mui/material';
import React from 'react';

const Condition = ({ formValues, setFormValues,   }) => {
    return (
        <>
        <Grid item xs={12} md={12} className='p-3'>
            
                <CustomTextField
                label='ประวัติการแพ้ยา'
                className="w-full sm:w-4/12 px-3"
                />
                <CustomTextField
                label='ระบุชื่อสารก่อภูมิแพ้'
                 className="w-full sm:w-4/12 px-3"
                />
                <CustomTextField
                label='อาการแพ้'
                className="w-full sm:w-4/12 px-3"
                />
           
        </Grid>
        </>
    );
}

export default Condition;
