import { Avatar, Button, Card, CardContent, Checkbox, Chip, FormControlLabel, Grid, Typography } from '@mui/material'

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

const nullAvatar = user => {
  if (!user.file && user.gender === 'หญิง') {
    return <Avatar variant='rounded' src='/images/null-avatar/girls.jpg' sx={{ width: 120, height: 120, mb: 3 }} />
  }
  if (!user.file && user.gender === 'ชาย') {
    return <Avatar variant='rounded' src='/images/null-avatar/mans.jpg' sx={{ width: 120, height: 120, mb: 3 }} />
  } else {
    return <Avatar variant='rounded' src={user.file} sx={{ width: 120, height: 120, mb: 3 }} />
  }
}
const ReferUserDetails = ({ user, hnPrefix,dataOpds, ptDataIdcard }) => {
  console.log("User details", ptDataIdcard)
  if(user && dataOpds){
    const { years, months, days } = calculateAgeDetail(user.birthDate)
    const allergyData = dataOpds[0]?.Allergy || [];
    const cleanedAllergyCodes = allergyData
    .map(item => item.AL1_ALLERGY_REACTIONCODE.replace(/^[-\d\s]+/, "").trim())
    .filter(code => code); // กรองค่าที่ว่างออกไป
  
  // รวมค่าทั้งหมดเข้าด้วยกัน โดยใช้ , คั่น
  const allergyCodesString = cleanedAllergyCodes.join(", "); 
  
    return (
      <Card>
        {/* <CardHeader /> */}
        <CardContent>
          {/* <Avatar src= alt='Victor Anderson' /> */}
          <Grid container className='space-y-3'>
            <Grid item xs={12} sm={4} md={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {nullAvatar(user)}
            </Grid>
            <Grid item xs={12} sm={4} md={3} className='space-y-3'>
              {/* <Button variant='outlined' size='medium' disabled> {hnPrefix + user.hn} </Button> */}
              <Typography variant='h6'>
                ชื่อ-นามสกุล : <span className=' text-primary'>{`${user.firstnameTH} ${user.lastnameTH}`}</span>
              </Typography >
              <Typography variant='h6'>เลขบัตรประชาชน :<span className=' text-primary'>{user.idCardNumber}</span> </Typography>
              <Typography variant='h6'>
                เพศ : <span className=' text-primary'>{user.gender}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className='space-y-3'>
              <Typography variant='h6'>
                วันเกิด :{' '}
                <span className='text-primary'>{`${new Date(user.birthDate).getDate()}/${new Date(user.birthDate).getMonth() + 1}/${new Date(user.birthDate).getFullYear() + 543}`} </span>
              </Typography>
              <Typography variant='h6'>
                อายุ : <span  className='text-primary'>{years} ปี {months} เดือน {days} วัน </span> 
              </Typography>
              <Typography variant='h6'>หมายเลขโทรศัพท์ : <span className='text-primary'>{user.tel}</span></Typography>
              {/* <Typography variant='h6'>ประวัติการแพ้ยา</Typography>
                          <Typography>{user.drugAllergy ? user.drugAllergy : '-'}</Typography>
                          <Typography variant='h6'>โรคประจำตัว</Typography>
                          <Typography>{user.congenitalDisease ? user.congenitalDisease : '-'}</Typography> */}
            </Grid>
            <Grid item xs={12} sm={4} md={3} className='space-y-3'>
              <Typography variant='h6'>สิทธิการรักษาหลัก</Typography>
              <Typography>{dataOpds?.[0]?.PV1_PATIENT_ACCOUNT_NAME ?? '-'}</Typography>
              <Typography variant='h6'>ข้อมูลการแพ้ยา (Patient Allergy)</Typography>
              <Typography>{allergyCodesString}</Typography>
  
            </Grid>
            <Grid item xs={12} sm={6} md={3} className='space-y-3'>
              {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <FormControlLabel label='API Link' control={<Checkbox name='basicAPI' disabled={false} />} />
                              <Button variant='outlined' disabled={false}> ดึงข้อมูล </Button>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <FormControlLabel label='Health Link' control={<Checkbox name='basicHealth' disabled={true} />} />
                              <Button variant='outlined' disabled={true}> ดึงข้อมูล </Button>
                          </div> */}
              {user.isRefer && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Chip label='รอส่งตัว' color='secondary' />
                </div>
              )}
              {user.isRefer && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Chip label='รอยืนยันรับตัว' color='warning' />
                </div>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }

}

export default ReferUserDetails
