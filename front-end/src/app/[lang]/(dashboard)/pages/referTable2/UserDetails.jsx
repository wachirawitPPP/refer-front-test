import { Button, Card, CardContent, Checkbox, Chip, FormControlLabel, Grid, Typography } from '@mui/material'

const calculateAgeDetail = (dob) => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        // Use the last day of the previous month
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
};

const nullAvatar = (user) => {
    if (!user.avatar && user.gender === 'หญิง' ){
        return <img src="/images/null-avatar/girls.jpg" alt="Girl's Avatar"  style={{ borderRadius: '50%', width: '60%' }}/>
    }
    if(!user.avatar && user.gender === 'ชาย'){
        return <img src="/images/null-avatar/mans.jpg" alt="Man's Avatar" style={{ borderRadius: '50%', width: '60%' }} />
    }
}



const UserDetails = ({ user }) => {
    const { years, months, days } = calculateAgeDetail(user.birthDate);


    return (
        <Card>
            {/* <CardHeader /> */}
            <CardContent>
                {/* <Avatar src= alt='Victor Anderson' /> */}
                <Grid container className='space-y-3'>
                    <Grid item xs={12} sm={4} md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {nullAvatar(user)}
                    </Grid>
                    <Grid item xs={12} sm={4} md={2} className='space-y-3'>
                        <Button variant='outlined' size='medium' disabled> {user.hn} </Button>
                        <Typography>{`${user.firstnameTH} ${user.lastnameTH} (${user.nickname})`}</Typography>
                        <Typography>เพศ : {user.gender} วันเกิด : {`${new Date(user.birthDate).getDate()}/${new Date(user.birthDate).getMonth()+1}/${new Date(user.birthDate).getFullYear()+543}`}</Typography>
                        <Typography>อายุ : {years} ปี {months} เดือน {days} วัน</Typography>
                        <Typography>{user.idCardNumber}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} md={2} className='space-y-3'>
                        <Typography variant='h6'>สิทธิการรักษาหลัก</Typography>
                        <Typography>{user.mainTreatmentRights}</Typography>
                        <Typography variant='h6'>สิทธิการรักษารอง</Typography>
                        <Typography>{user.secondaryTreatmentRights}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2} className='space-y-3'>
                        <Typography variant='h6'>ประวัติการแพ้ยา</Typography>
                        <Typography>{user.drugAllergy? user.drugAllergy:'-'}</Typography>
                        <Typography variant='h6'>โรคประจำตัว</Typography>
                        <Typography>{user.congenitalDisease? user.congenitalDisease:'-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} className='space-y-3'>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <FormControlLabel label='API Link' control={<Checkbox name='basicAPI' disabled={false} />} />
                            <Button variant='outlined' disabled={false}> ดึงข้อมูล </Button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <FormControlLabel label='Health Link' control={<Checkbox name='basicHealth' disabled={true} />} />
                            <Button variant='outlined' disabled={true}> ดึงข้อมูล </Button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                            <Chip label='รอส่งตัว' color='secondary' />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                            <Chip label='รอยืนยันรับตัว' color='warning' />
                        </div>
                    </Grid>
                </Grid>
                {/* {user.hn} */}
            </CardContent>
        </Card>
    )
}

export default UserDetails