import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { Card, CardContent, Grid, Typography, Avatar } from '@mui/material'

const GeneralData = ({ patientData, pt_data_idcacrd, loading, dataOpds }) => {
  console.log(pt_data_idcacrd)
  if (loading) {
    return (
      <Card
        className='my-4'
        sx={{
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', // Soft shadow
          padding: 3,
          border: '2px solid #f6b1a7' // Colored border for a playful effect
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress />
        </div>
      </Card>
    )
  }

  const formatAge = (value) => {
    // const dateStr = value // Assuming res.PID_PATIENT_DATE_TIME_OF_BIRTH is 19460310
    // console.log("dob", dateStr)
    // const year = dateStr.substring(0, 4) // Extract the year
    // const month = dateStr.substring(4, 6).padStart(2, '0') // Extract and pad the month
    // const day = dateStr.substring(6, 8).padStart(2, '0') // Extract and pad the day
    // const formattedDate = `${year}-${month}-${day}`
    if (value) {

      var mdate = value.toString();
      var dobYear = parseInt(mdate.substring(0, 4), 10);
      var dobMonth = parseInt(mdate.substring(5, 7), 10);
      var dobDate = parseInt(mdate.substring(8, 10), 10);

      //get the current date from system
      var today = new Date();
      //date string after broking
      var birthday = new Date(dobYear, dobMonth - 1, dobDate);

      //calculate the difference of dates
      var diffInMillisecond = today.valueOf() - birthday.valueOf();

      //convert the difference in milliseconds and store in day and year variable
      var year_age = Math.floor(diffInMillisecond / 31536000000);
      var day_age = Math.floor((diffInMillisecond % 31536000000) / 86400000);

      //when birth date and month is same as today's date
      if (
        today.getMonth() == birthday.getMonth() &&
        today.getDate() == birthday.getDate()
      ) {
        alert("Happy Birthday!");
      }

      var month_age = Math.floor(day_age / 30);
      var day_ageday_age = day_age % 30;

      var tMnt = month_age + year_age * 12;
      // var tDays = tMnt * 30 + day_age;
      return `${year_age}`;
    }
  };
  const formatDate = (string) => {
    if (string != null) {
      let year = parseInt(string.substring(0, 4)) + 543; // Convert to Buddhist year
      let month = parseInt(string.substring(5, 7));
      let day = string.substring(8, 10);

      const months_th = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
      ];

      let formattedDate = `${parseInt(day)} ${months_th[month - 1]} ${year}`;
      return formattedDate;
    } else {
      return string;
    }
  };

  if (!patientData) {
    // Array of random background colors for the avatar
    const avatarColors = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#B565A7', '#009B77']

    // Function to pick a random color from the array
    const getRandomColor = () => {
      const randomIndex = Math.floor(Math.random() * avatarColors.length)
      return avatarColors[randomIndex]
    }



    const firstLetter = pt_data_idcacrd?.firstnameTH?.charAt(0).toUpperCase() || ''
    return (
      // <Card
      //   className='my-4 p-4 border-error'
      //   sx={{
      //     borderRadius: 2,
      //     boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', // Soft shadow
      //     padding: 3,
      //     border: '2px solid ' // Colored border for a playful effect
      //   }}
      // >
      //   <CardContent>
      //    <Typography variant='h4' className='flex justify-center'>ไม่พบข้อมูล</Typography>
      //   </CardContent>
      // </Card>
      <Card
        className='my-4 p-4 border-primary'
        sx={{
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', // Soft shadow
          padding: 3,
          border: '2px solid ' // Colored border for a playful effect
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: getRandomColor(),
                  width: 64,
                  height: 64,
                  fontSize: 28,
                  color: 'white',
                  border: '3px solid #fff', // Border to make the avatar stand out
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.2)' // Add shadow to the avatar
                }}
              >
                {firstLetter}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={4} md={3} className='space-y-1 mb-3'>
              <Typography variant='h6'>ชื่อ-นามสกุล : <span className=' text-primary'>{`${pt_data_idcacrd?.firstnameTH ?? "-"} ${pt_data_idcacrd?.lastnameTH ?? "-"}`}</span> </Typography>
              <Typography variant='h6'>เลขบัตรประชาชน :<span className=' text-primary'>{pt_data_idcacrd?.idCardNumber ?? "-"}</span> </Typography>
              <Typography variant='h6'>
                เพศ : <span className=' text-primary'> {pt_data_idcacrd?.gender === 'หญิง'
                  ? 'หญิง'
                  : pt_data_idcacrd?.gender === 'ชาย'
                    ? 'ชาย'
                    : '-'}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className='space-y-1'>
              <Typography variant='h6' >
                วันเกิด : <span className='text-primary'>{formatDate(pt_data_idcacrd?.birthDate ?? "-")}</span>
              </Typography>
              <Typography variant='h6'>อายุ: <span className='text-primary'>{formatAge(pt_data_idcacrd?.birthDate ?? "-")}  ปี</span></Typography>
              <Typography variant='h6'>
                หมายเลขโทรศัพท์ : <span className='text-primary'>{pt_data_idcacrd?.tel ?? "-"}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className='space-y-1'>
              <Typography variant='h6' >
                สิทธิการรักษาหลัก :
              </Typography>
              <Typography variant='h6' >
                <span className='text-primary'> - </span>
              </Typography>
              <Typography variant='h6' >
                ข้อมูลการแพ้ยา (Patient Allergy) :
              </Typography>
              <Typography variant='h6' >
                <span className='text-primary'> - </span>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }

  const firstLetter = patientData.PID_PATIENT_NAME?.charAt(0).toUpperCase() || ''

  // Array of random background colors for the avatar
  const avatarColors = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#B565A7', '#009B77']

  // Function to pick a random color from the array
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * avatarColors.length)
    return avatarColors[randomIndex]
  }

  const formatBirthDate = dateString => {
    const year = parseInt(dateString.substring(0, 4), 10)
    const month = parseInt(dateString.substring(4, 6), 10) - 1
    const day = parseInt(dateString.substring(6, 8), 10)

    const birthDate = new Date(year, month, day)

    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(birthDate)
  }

  const calculateAge = birthDate => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const calculateAgeDetail = dob => {
    if (!dob) return null

    const birthDate = new Date(dob)
    const today = new Date()

    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    let days = today.getDate() - birthDate.getDate()

    if (days < 0) {
      months--
      // Use the last day of the previous month
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += lastMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    return { years, months, days }
  }

  const birthDate = formatBirthDate(patientData.PID_PATIENT_DATE_TIME_OF_BIRTH)
  const age = calculateAge(
    new Date(
      patientData.PID_PATIENT_DATE_TIME_OF_BIRTH.substring(0, 4),
      patientData.PID_PATIENT_DATE_TIME_OF_BIRTH.substring(4, 6) - 1,
      patientData.PID_PATIENT_DATE_TIME_OF_BIRTH.substring(6, 8)
    )
  )
  const allergyData = dataOpds[0]?.Allergy || [];

  const cleanedAllergyCodes = allergyData
  .map(item => item.AL1_ALLERGY_REACTIONCODE.replace(/^[-\d\s]+/, "").trim())
  .filter(code => code); // กรองค่าที่ว่างออกไป

// รวมค่าทั้งหมดเข้าด้วยกัน โดยใช้ , คั่น
const allergyCodesString = cleanedAllergyCodes.join(", "); 
 
  return (
    <Card
      className='my-4 p-4 border-primary'
      sx={{
        borderRadius: 2,
        boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', // Soft shadow
        padding: 3,
        border: '2px solid ' // Colored border for a playful effect
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: getRandomColor(),
                width: 64,
                height: 64,
                fontSize: 28,
                color: 'white',
                border: '3px solid #fff', // Border to make the avatar stand out
                boxShadow: '0px 4px 10px rgba(0,0,0,0.2)' // Add shadow to the avatar
              }}
            >
              {firstLetter}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={4} md={3} className='space-y-1 mb-3'>
            <Typography variant='h6'>ชื่อ-นามสกุล : <span className=' text-primary'>{`${patientData.PID_PATIENT_NAME} ${patientData.PID_PATIENT_LASTNAME}`}</span> </Typography>
            <Typography variant='h6'>เลขบัตรประชาชน :<span className=' text-primary'>{patientData.PID_PATIENT_IDENTIFIER_LIST}</span> </Typography>
            <Typography variant='h6'>
              เพศ : <span className=' text-primary'> {patientData.PID_PATIENT_ADMINISTRATIVE_SEX === 'F'
                ? 'หญิง'
                : patientData.PID_PATIENT_ADMINISTRATIVE_SEX === 'M'
                  ? 'ชาย'
                  : '-'}</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} className='space-y-1'>
            <Typography variant='h6' >
              วันเกิด : <span className='text-primary'>{birthDate}</span>
            </Typography>
            <Typography variant='h6'>อายุ: <span className='text-primary'>{age} ปี</span></Typography>
            <Typography variant='h6'>
              หมายเลขโทรศัพท์ : <span className='text-primary'>{patientData.PID_PATIENT_PHONE_NUMBER_BUSINESS}</span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} className='space-y-1'>
            <Typography variant='h6' >
              สิทธิการรักษาหลัก :
            </Typography>
            <Typography variant='h6' >
              <span className='text-primary'> {dataOpds[0]?.PV1_PATIENT_ACCOUNT_NAME} </span>
            </Typography>
            <Typography variant='h6' >
              ข้อมูลการแพ้ยา (Patient Allergy) :
            </Typography>
            <Typography variant='h6' >
              <span className='text-primary'>  {allergyCodesString}</span>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default GeneralData
