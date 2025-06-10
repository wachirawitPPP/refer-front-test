import React from 'react'
import { Card, CardContent, CardHeader, Divider, Grid, Typography } from '@mui/material'
const VitalSigns = ({data}) => {
  return (
    <>
      <Card className='my-2  border-l-8 border-indigo-500'>
        <CardHeader className='text-primary' title='Vital Signs' />
        <Divider></Divider>
        <CardContent className='space-y-2'>
          <Grid item md={12} className='my-3'>
            <div className=' w-8/12  flex flex-row space-x-4'>
              <Typography>Reason</Typography>
              <Typography variant='h6'>{data.PV2_VISIT_DESCRIPTION||'-'}</Typography>
            </div>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className=' w-8/12  flex flex-row space-x-10'>
                <div className='w-full'>
                  <Typography>Diastolic blood pressure</Typography>
                </div>
                <div className='w-4/12 flex justify-end'>
                  <div className=' w-full flex justify-start space-x-1'>
                    <Typography variant='h6'>{data.VITAL_SIGN_DIASTOLIC_BLOOD_PRESSURE_DBP||'-'}</Typography>
                    <Typography variant='h6'>mm[Hg]</Typography>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid  item xs={12} md={6}>
              <div className=' w-8/12  flex flex-row space-x-10'>
                <div className='w-full'>
                  <Typography>อุณหภูมิร่างกาย (Temperature)</Typography>
                </div>
                <div className='w-4/12 flex justify-end'>
                  <div className=' w-full flex justify-start space-x-1'>
                    <Typography variant='h6'>{data.VITAL_SIGN_TEMPERATURE||'-'}</Typography>
                    <Typography variant='h6'>cel</Typography>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className=' w-8/12  flex flex-row space-x-10'>
                <div className='w-full'>
                  <Typography>Systolic blood pressure</Typography>
                </div>
                <div className='w-4/12 flex justify-end'>
                  <div className=' w-full flex justify-start space-x-1'>
                    <Typography variant='h6'>{data.VITAL_SIGN_SYSTOLIC_BLOOD_PRESSURE_SBP||'-'}</Typography>
                    <Typography variant='h6'>mm[Hg]</Typography>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item  xs={12} md={6}>
              <div className=' w-8/12  flex flex-row space-x-10'>
                <div className='w-full'>
                  <Typography>อัตราการเต้นของหัวใจ (Heart Rate)</Typography>
                </div>
                <div className='w-4/12 flex justify-end'>
                  <div className=' w-full flex justify-start space-x-1'>
                    <Typography variant='h6'>{data.VITAL_SIGN_HEART_RATE||'-'}</Typography>
                    <Typography variant='h6'>ครั้ง/นาที</Typography>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className=' w-8/12  flex flex-row space-x-10'>
                <div className='w-full'>
                  <Typography>น้ำหนัก (Weight)</Typography>
                </div>
                <div className='w-4/12 flex justify-end space-x-2'>
                  <div className=' w-full flex  justify-start space-x-1'>
                    <Typography variant='h6'>{data.VITAL_SIGN_WEIGHT||'-'}</Typography>
                    <Typography variant='h6'>kg</Typography>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className=' w-8/12  flex flex-row space-x-10'>
                <div className='w-full'>
                  <Typography>อัตราการหายใจ (Respiratory Rate)</Typography>
                </div>
                <div className='w-4/12 flex justify-end'>
                  <div className=' w-full flex justify-start space-x-1'>
                    <Typography variant='h6'>{data.VITAL_SIGN_RESPIRATORY_RATE||'-'}</Typography>
                    <Typography variant='h6'>ครั้ง/นาที</Typography>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className=' w-8/12  flex flex-row space-x-10'>
                <div className='w-full'>
                  <Typography>ส่วนสูง (Height)</Typography>
                </div>
                <div className='w-4/12 flex justify-end'>
                  <div className=' w-full flex justify-start space-x-1'>
                    <Typography variant='h6'>{data.VITAL_SIGN_HEIGHT||'-'}</Typography>
                    <Typography variant='h6'>cm</Typography>
                  </div>
                </div>
              </div>
            </Grid>
            {/* <Grid item md={6}>
              <div className=' w-8/12  flex flex-col space-x-10'>
                <div className='w-full'>
                  <Typography>รายละเอียดเพิ่มเติม</Typography>
                </div>
                <div className='w-4/12 flex justify-end'>
                  <div className=' w-full flex justify-start space-x-1'>
                    <Typography variant='h6'>180</Typography>
                    <Typography variant='h6'>cm</Typography>
                  </div>
                </div>
              </div>
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default VitalSigns
