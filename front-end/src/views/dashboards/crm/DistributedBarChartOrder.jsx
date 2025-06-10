'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'


const DistributedBarChartOrder = () => {
  return (
    <>
    
    <Card className='h-60'>
      <CardHeader title='รายการรับตัว (Refer In)' subheader='Last Week' className='pbe-0' />
      <CardContent className='flex flex-col'>
        {/* <AppReactApexCharts type='bar' height={250} width='100%' options={options} series={series} /> */}
        <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5'>
          <Typography variant='h4' color='error.main'>
           Emergency
          </Typography>
          <Typography variant='body2' color='success.main'>
            +12.6%
          </Typography>
        </div>
        <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5'>
          <Typography variant='h4' color='warning.main'>
           Urgency
          </Typography>
          <Typography variant='body2' color='success.main'>
            +12.6%
          </Typography>
        </div>
        <div className='flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5'>
          <Typography variant='h4' color='secondary.main'>
           Elective
          </Typography>
          <Typography variant='body2' color='success.main'>
            +12.6%
          </Typography>
        </div>
      </CardContent>
    </Card>
    </>
    
  )
}

export default DistributedBarChartOrder
