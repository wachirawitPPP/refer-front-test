'use client'
import CustomTextField from '@/@core/components/mui/TextField'
import { Grid, MenuItem } from '@mui/material'
import React from 'react'
import treatmentRrights from '../../../../../data/ref_right_treatments.json'

// Data Imports

export default function Health({formData, setFormData,sendData}) {
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevValues) => {
          const newValues = {
            ...prevValues,
            [name]: value,
          };
        //   console.log(newValues, "setFormData---");
          return newValues;
        });
    };

    return (
        <>
            {/* <Card>
                <CardHeader title='ข้อมูลสุขภาพ' />
                <CardContent> */}

            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={6} className='p-3 space-y-5'>
                    <CustomTextField select fullWidth  name="mainTreatmentRights" value={formData.mainTreatmentRights||''} onChange={handleChange} label='ประเภทสิทธิ์การรักษาหลัก' id='custom-select' required error={!formData.mainTreatmentRights && sendData} SelectProps={{
                        MenuProps: {
                            PaperProps: {
                                style: {
                                    maxHeight: 200, // Adjust the height as needed
                                    overflow: 'auto',
                                },
                            },
                        },
                    }}
                    >
                        {treatmentRrights.RECORDS.map((option) => (
                            <MenuItem key={option.rt_name} value={option.rt_name}>
                                {option.rt_code+" : "+option.rt_name}
                            </MenuItem>
                        ))}
                    </CustomTextField>

                    <CustomTextField select fullWidth name="secondaryTreatmentRights" value={formData.secondaryTreatmentRights||''}  onChange={handleChange} label='ประเภทสิทธิ์การรักษารอง' id='custom-select' error={!formData.secondaryTreatmentRights && sendData} required SelectProps={{
                        MenuProps: {
                            PaperProps: {
                                style: {
                                    maxHeight: 200, // Adjust the height as needed
                                    overflow: 'auto',
                                },
                            },
                        },
                    }}>
                        {treatmentRrights.RECORDS.map((option) => (
                            <MenuItem key={option.rt_name} value={option.rt_name}>
                                {option.rt_code+" : "+option.rt_name}
                            </MenuItem>
                        ))}
                    </CustomTextField>

                    <CustomTextField
                        rows={4}
                        multiline
                        fullWidth
                        // maxRows={4}
                        // value={value}
                        name="note2"
                        label='หมายเหตุ'
                        onChange={handleChange}
                        value={formData.note2||''}
                    // id='textarea-outlined-controlled'
                    />

                </Grid>
                <Grid item xs={12} sm={6} md={6} className='p-3 space-y-5'>
                    <CustomTextField
                        rows={4}
                        multiline
                        fullWidth
                        name="drugAllergy"
                        // value={formValues}
                        label='ประวัติการแพ้ยา'
                    onChange={handleChange}
                    value={formData.drugAllergy||''}
                    // id='textarea-outlined-controlled'
                    />
                    <CustomTextField
                        rows={4}
                        multiline
                        fullWidth
                        name="mentalhealth"
                        // maxRows={4}
                        // value={value}
                        label='ประวัติสุขภาพจิต'
                        value={formData.mentalhealth||''}
                        onChange={handleChange}
                    // id='textarea-outlined-controlled'
                    />
                    <CustomTextField
                        rows={4}
                        multiline
                        fullWidth
                        name="congenitalDisease"
                        // maxRows={4}
                        // value={value}
                        label='โรคประจำตัว'
                        value={formData.congenitalDisease||''}
                    onChange={handleChange}
                    // id='textarea-outlined-controlled'
                    />
   
                </Grid>
            </Grid >

        </>
    )
}
