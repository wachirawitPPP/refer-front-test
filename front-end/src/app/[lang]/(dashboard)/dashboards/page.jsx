'use client' // This is your client component

// MUI Imports
import Grid from '@mui/material/Grid'
import { Box, Button, Container, Typography, TextField, Card, IconButton } from '@mui/material'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { signOut,useSession } from 'next-auth/react'
import axios from 'axios'
// Icons
// import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
// import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
// import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
// import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'

// Next.js dynamic import to prevent SSR issues with ReactApexChart
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { getLocalizedUrl } from '@/utils/i18n' 
import { toast } from 'react-toastify'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const DashboardCRM = ({}) => {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    statusStats: [],
    totalCount: 0
  })
  const getDefaultDates = () => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    return {
      from: firstDayOfMonth.toISOString().split('T')[0], // YYYY-MM-01
      to: today.toISOString().split('T')[0] // YYYY-MM-DD (current date)
    }
  }

  const defaultDates = getDefaultDates()
  const [dateFrom, setDateFrom] = useState(defaultDates.from)
  const [dateTo, setDateTo] = useState(defaultDates.to)
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const { lang: locale } = useParams()
  useEffect(() => {
    setIsMounted(true)
    if (session?.user?.token) {
      fetchDashboardData()
    }
  }, [session, dateFrom, dateTo])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_TEST_API_URL}/dashboard?dateFrom=${dateFrom}&dateTo=${dateTo}`,
        {
          headers: {
            Authorization: `${session?.user?.token}`
          }
        }
      )
      const data_ = await response.data
      if (data_.success) {
        setDashboardData(data_.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // เพิ่ม default data เมื่อ fetch ไม่สำเร็จ
      if(error.response.data.message === 'Failed to verify token') {
        toast.warning('Your session has expired') 
        await signOut({ redirect: false })
        router.push(getLocalizedUrl('/login', locale))
      }
      setDashboardData({
        statusStats: [
          { status: '1', count: 0 },
          { status: '2', count: 0 },
          { status: '3', count: 0 },
          { status: '4', count: 0 },
          { status: '5', count: 0 },
          { status: '6', count: 0 }
        ],
        totalCount: 0
      })
    } finally {
      setIsLoading(false)
    }
  }
   // ในส่วน return เพิ่ม loading state
  if (!session) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Typography>กรุณาเข้าสู่ระบบ...</Typography>
      </Container>
    )
  }
   if (isLoading) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Typography>กำลังโหลดข้อมูล...</Typography>
      </Container>
    )
  }

  const getStatusCount = status => {
    const statusItem = dashboardData.statusStats.find(item => item.status === status)
    return statusItem ? statusItem.count : 0
  }

  const chartOptions = {
    chart: {
      type: 'pie'
    },
    labels: ['รอตอบรับการปรึกษา', 'ตอบรับปรึกษาแล้ว', 'เสร็จสิ้น', 'ยกเลิก', 'ส่งต่อ', 'ส่งกลับ'],
    colors: ['#FFB400', '#28C76F', '#0D6EFD', '#EA5455', '#7367F0', '#FF9F43'],
    legend: {
      position: 'bottom',
      fontSize: '14px',
      labels: {
        colors: '#333'
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + '%'
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  }
  // Calculate percentages for the pie chart
  const calculateChartData = () => {
    const total = dashboardData.totalCount || 1; // Prevent division by zero
    return [
      (getStatusCount('1') / total) * 100, // รอตอบรับการปรึกษา
      (getStatusCount('2') / total) * 100, // ตอบรับปรึกษาแล้ว
      (getStatusCount('3') / total) * 100, // เสร็จสิ้น
      (getStatusCount('4') / total) * 100, // ยกเลิก
      (getStatusCount('5') / total) * 100, // ส่งต่อ
      (getStatusCount('6') / total) * 100  // ส่งกลับ
    ];
  }; 
  // Handle date changes and data refresh
  const handleDateChange = () => {
    fetchDashboardData()
  }

  return (
    <div className='dashboard-container'>
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Card sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant='h6' className='mt-2'>
            วันที่เริ่มต้น / วันที่สิ้นสุด
          </Typography>
          <Grid container spacing={2} justifyContent='center' sx={{ my: 2 }}>
            <Grid item>
              <TextField type='date' value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </Grid>
            <Grid item>
              <TextField type='date' value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </Grid>
          </Grid>
          <Button variant='contained' color='primary' className='mb-3' onClick={handleDateChange}>
            ดูข้อมูล
          </Button>
        </Card>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Card sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', mt: 1 }}>
                <IconButton>
                  <i className='tabler-clock text-[30px] text-warning hover:text-secondary cursor-pointer' />
                </IconButton>
                <Typography variant='h6'>รอตอบรับการปรึกษา ทั้งหมด</Typography>
                <Typography variant='h4' className='text-warning'>
                  {getStatusCount('1')} ราย
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', mt: 1 }}>
                <IconButton>
                  <i className='tabler-clock-up text-[30px] text-primary hover:text-secondary cursor-pointer' />
                </IconButton>
                <Typography variant='h6'>ส่งกลับ ทั้งหมด</Typography>
                <Typography variant='h4' className='text-primary'>
                  {getStatusCount('6')} ราย
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', mt: 1 }}>
                <IconButton>
                  <i className='tabler-copy-check text-[30px] text-success hover:text-secondary cursor-pointer' />
                </IconButton>
                <Typography variant='h6'>ตอบรับปรึกษาแล้ว ทั้งหมด</Typography>
                <Typography variant='h4' className='text-success'>
                  {getStatusCount('2')} ราย
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', mt: 1 }}>
                <IconButton>
                  <i className='tabler-copy-x text-[30px] text-error hover:text-secondary cursor-pointer' />
                </IconButton>
                <Typography variant='h6'>ยกเลิก ทั้งหมด</Typography>
                <Typography variant='h4' color='error'>
                  {getStatusCount('5')} ราย
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
        {/* ... rest of your code ... */}

        <Card sx={{ p: 4, mt: 4 }}>
          <Typography variant='h6' sx={{ mb: 3, textAlign: 'center' }}>
            สถิติสถานะเคส รับ/ส่ง ปรึกษา
          </Typography>
          {isMounted && (
            <Box sx={{ height: '400px' }}>
              <ReactApexChart options={chartOptions} series={calculateChartData()} type='pie' height={400} />
            </Box>
          )}
        </Card>
      </Container>
    </div>
  )
}

export default DashboardCRM
