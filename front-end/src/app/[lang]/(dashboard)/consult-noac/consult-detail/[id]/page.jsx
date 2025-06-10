'use client'
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Select,
  MenuItem,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip
} from '@mui/material'
import React, { useState } from 'react'
import CustomTextField from '@core/components/mui/TextField'
const data = {
  id: 52,
  name: 'ประมูล จิตนิคม',
  hn: '24100016',
  id_card: '3101000312970',
  department: 'อายุรกรรมหัวใจ',
  customer_id: 42,
  dest_department_id: 9,
  dest_department_name: null,
  departmentId: 1,
  urgent: 1,
  note: '',
  doctor_note: 'รับปรึกษา\nทดสอบแก้ไข วันที่:2024-10-24 เวลา: 13:39 น.',
  nurse_note: '',
  regis_note: '',
  refer_by: 'นายแพทย์ เทสดี',
  referDate: '2024-10-18T06:41:10.000Z',
  confirmDate: '2024-10-24T13:39:45.750Z',
  destinationHospital: 'โรงพยาบาลตากสิน',
  dest_hospital_id: 2,
  recive_by: 'หมอ 2',
  hospital_id: 1,
  originHospital: 'โรงพยาบาล3',
  status: '2',
  noac_result: '',
  createdAt: '2024-10-18T06:41:10.81 7Z',
  updatedAt: '2024-10-24T06:39:45.752Z',
  Customer: {
    id: 42,
    gender: 'หญิง',
    title: 'ไม่ระบุ',
    religion: 'ไม่ระบุ',
    nationality: 'ไม่ระบุ',
    education: 'ไม่ระบุ',
    bloodtype: 'ไม่ระบุ',
    firstnameTH: 'ประมูล',
    lastnameTH: 'จิตนิคม',
    firstnameEN: '',
    lastnameEN: '',
    address: '',
    province: '',
    provinceId: null,
    amphur: '',
    amphurId: null,
    tambon: '',
    tambonId: null,
    birthDate: '1959-11-25T00:00:00.000Z',
    email: '',
    idCardNumber: '3101000312970',
    maritalOptions: 'ไม่ระบุ',
    nickname: '',
    note: '',
    passportNumber: '',
    tag: '',
    tel: '0867923952',
    zipCode: '',
    hospitalId: 1,
    hospital_code: null,
    isRefer: false,
    createdAt: '2024-10-15T04:57:26.202Z',
    updatedAt: '2024-10-18T10:03:14.712Z',
    relation: [],
    congenitalDisease: '',
    drugAllergy: '',
    mainTreatmentRights: '',
    mentalhealth: '',
    secondaryTreatmentRights: '',
    hn: 'TS24100018',
    isActive: true,
    file: '',
    note2: '',
    filePath: null
  },
  Department: {
    id: 1,
    name: 'อายุรกรรม',
    secretKey: 'r4Ba8c8TjHW5ZpN36yX21cYmlhXEsZsfPH4QA0j1d9s',
    departmentCode: 'DE0001',
    hospitalId: 1,
    isActive: true,
    createdAt: '2024-07-22T08:09:07.278Z',
    updatedAt: '2024-10-04T07:29:01.556Z'
  },
  Dest_department: {
    id: 9,
    name: 'กุมารเวชกรรม',
    secretKey: null,
    departmentCode: '210000',
    hospitalId: 2,
    isActive: true,
    createdAt: '2024-09-12T07:42:48.667Z',
    updatedAt: '2024-09-12T07:42:48.667Z'
  },
  Hospital: {
    id: 1,
    name: 'โรงพยาบาล3',
    hospitalCode: 'H0003',
    licenseNumber: 'LI0001',
    HNCode: 'TS',
    address: '111',
    amphur: 'ครบุรี',
    amphurId: 3002,
    email: 'admin@admin.com',
    image:
      'https://refer-img.s3.ap-southeast-1.amazonaws.com/user/20240730031113_image.png?AWSAccessKeyId=AKIAU6GDYH6YRETNBZZR&Expires=1722309973&Signature=bpEo3ouoPsUzXcza22Hzyml89QE%3D',
    isActive: true,
    phone: '0444444444',
    province: 'นครราชสีมา',
    provinceId: 19,
    referCode: 'RF',
    serviceDesc: 'wellness',
    tambon: 'เฉลียง',
    zipCode: '30250',
    createdAt: '2024-07-22T08:09:07.278Z',
    tambonId: 300202,
    updatedAt: '2024-10-09T08:16:18.705Z',
    filePath: ''
  },
  opd_file: [],
  Destination_hospital: {
    id: 2,
    name: 'โรงพยาบาลตากสิน',
    hospitalCode: '11539',
    createdAt: '2024-07-22T09:35:26.757Z',
    updatedAt: '2024-09-12T09:09:10.182Z',
    isActive: true
  },
  opd_refer: [],
  refer_img: [],
  recive_img: []
}

const ConsultDetail = () => {
  const [selectedUser, setSelectedUser] = useState(data)

  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [scr, setScr] = useState('')
  const [gender, setGender] = useState('')
  const [crcl, setCrcl] = useState(null)

  const [bilirubin, setBilirubin] = useState('')
  const [albumin, setAlbumin] = useState('')
  const [inr, setInr] = useState('')
  const [ascites, setAscites] = useState('')
  const [hepaticEncephalopathy, setHepaticEncephalopathy] = useState('')
  const [childPughScore, setChildPughScore] = useState(null)
  const [childPughClass, setChildPughClass] = useState('')

  const [isNoac , setIsNoac] = useState(true)

  // States to control collapse for each section
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)

  const calculateCrCl = () => {
    if (!age || !weight || !scr || !gender) return

    const ageValue = parseFloat(age)
    const weightValue = parseFloat(weight)
    const scrValue = parseFloat(scr)

    let crCl = ((140 - ageValue) * weightValue) / (scrValue * 72)

    // Apply correction factor if the patient is female
    if (gender === 'female') {
      crCl *= 0.85
    }

    setCrcl(crCl.toFixed(2)) // Round to 2 decimal places
  }

  const calculateChildPugh = () => {
    if (!bilirubin || !albumin || !inr || !ascites || !hepaticEncephalopathy) return

    let score = 0

    // Bilirubin score
    if (bilirubin <= 2) score += 1
    else if (bilirubin > 2 && bilirubin <= 3) score += 2
    else score += 3

    // Albumin score
    if (albumin >= 3.5) score += 1
    else if (albumin >= 2.8 && albumin < 3.5) score += 2
    else score += 3

    // INR score
    if (inr <= 1.7) score += 1
    else if (inr > 1.7 && inr <= 2.3) score += 2
    else score += 3

    // Ascites score
    if (ascites === 'none') score += 1
    else if (ascites === 'mild') score += 2
    else score += 3

    // Hepatic Encephalopathy score
    if (hepaticEncephalopathy === 'none') score += 1
    else if (hepaticEncephalopathy === 'grade 1-2') score += 2
    else score += 3

    setChildPughScore(score)

    // Determine the Child-Pugh classification
    if (score >= 5 && score <= 6) {
      setChildPughClass('A')
    } else if (score >= 7 && score <= 9) {
      setChildPughClass('B')
    } else {
      setChildPughClass('C')
    }
  }

  const calculateAge = birthDate => {
    if (!birthDate) return '-'
    const today = new Date()
    const birthDateObj = new Date(birthDate)
    let years = today.getFullYear() - birthDateObj.getFullYear()
    let months = today.getMonth() - birthDateObj.getMonth()
    if (months < 0) {
      years--
      months += 12
    }
    return `${years} ปี ${months} เดือน`
  }

  return (
    <div className='w-full space-y-6'>
      <Card>
        <CardHeader title='สรุปข้อมูล' className='border-l-8  border-primary' />
        <Divider />
        <CardContent>
          {/* Cockcroft-Gault Input */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>ชื่อ-สกุล</Typography>
              <Typography variant='body1'>{selectedUser?.name ?? '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>HN</Typography>
              <Typography variant='body1'>{selectedUser?.hn ?? '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>เลขบัตรประชาชน</Typography>
              <Typography variant='body1'>{selectedUser?.id_card ?? '-'}</Typography>
            </Grid>
            
          </Grid>
          <Divider className='my-2' />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>อายุ (ปี)</Typography>
              <CustomTextField
                value={age}
                type='number'
                onChange={e => setAge(e.target.value)}
                placeholder='Enter age'
                className='w-6/12'
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>น้ำหนัก (กิโลกรัม)</Typography>
              <CustomTextField
                value={weight}
                type='number'
                onChange={e => setWeight(e.target.value)}
                placeholder='Enter weight'
                className='w-6/12'
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>Serum Creatinine (mg/dL)</Typography>
              <CustomTextField
                value={scr}
                type='number'
                onChange={e => setScr(e.target.value)}
                placeholder='Enter SCR'
                className='w-6/12'
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>เพศ</Typography>
              <CustomTextField select value={gender} onChange={e => setGender(e.target.value)} className='w-6/12'>
               
                <MenuItem value='male'>ชาย</MenuItem>
                <MenuItem value='female'>หญิง</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
          <Grid container className='my-2 flex justify-center'>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>CrCl (mL/min)</Typography>
              <CustomTextField value={crcl ?? ''} readOnly placeholder='CrCl' className='w-6/12' />
              <Button className='mx-2' onClick={calculateCrCl} variant='outlined'>
                คำนวณ
              </Button>
            </Grid>
          </Grid>
          <Divider className='my-2' />
          <Grid container className='my-2'>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>ข้อห้ามใช้ยา</Typography>
              { isNoac ? (<Chip label="มี" color="error" size='large' className='w-3/12' />):(<Chip label="ไม่มีมี" color="succces" size='large' className='w-3/12' />) }
             
            </Grid>
          </Grid>

          {/* Child-Pugh Score Input */}
          {/* <Divider className='my-4' />
          <Typography variant='h5'>Child-Pugh Score</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>Total Bilirubin (mg/dL)</Typography>
              <CustomTextField
                value={bilirubin}
                onChange={e => setBilirubin(e.target.value)}
                placeholder='Enter Bilirubin'
                className='w-6/12'
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>Serum Albumin (g/dL)</Typography>
              <CustomTextField
                value={albumin}
                onChange={e => setAlbumin(e.target.value)}
                placeholder='Enter Albumin'
                className='w-6/12'
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>INR</Typography>
              <CustomTextField
                value={inr}
                onChange={e => setInr(e.target.value)}
                placeholder='Enter INR'
                className='w-6/12'
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>Ascites</Typography>
              <CustomTextField select value={ascites} onChange={e => setAscites(e.target.value)} className='w-6/12'>
                <MenuItem value='none'>None</MenuItem>
                <MenuItem value='mild'>Mild</MenuItem>
                <MenuItem value='moderate'>Moderate</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>Hepatic Encephalopathy</Typography>
              <CustomTextField
                select
                value={hepaticEncephalopathy}
                onChange={e => setHepaticEncephalopathy(e.target.value)}
                className='w-6/12'
              >
                <MenuItem value='none'>None</MenuItem>
                <MenuItem value='grade 1-2'>Grade 1-2</MenuItem>
                <MenuItem value='grade 3-4'>Grade 3-4</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>

          <Divider className='my-2' />
          <Grid container>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>Child-Pugh Score</Typography>
              <CustomTextField
                value={childPughScore ?? ''}
                readOnly
                placeholder='Child-Pugh score will be calculated'
                className='w-6/12'
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant='h6'>Child-Pugh Class</Typography>
              <CustomTextField
                value={childPughClass ?? ''}
                readOnly
                placeholder='Class will be shown'
                className='w-6/12'
              />
            </Grid>
          </Grid>
          <Divider className='my-2' />
          <Grid container justifyContent='flex-start'>
            <Grid item>
              <button
                onClick={calculateChildPugh}
                className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark'
              >
                Calculate Child-Pugh
              </button>
            </Grid>
          </Grid> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title='ผลการประเมิน' />
        <CardContent>
          <Card className='my-2'>
            <CardHeader
              onClick={() => {
                setOpen1(!open1)
              }}
              title='1. ขนาดยา NOAC'
              className='border-l-8 border-primary hover:bg-gray-100 cursor-pointer'
            />

            <Collapse in={open1} timeout='auto' unmountOnExit>
              <Divider />
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead className='bg-primary'>
                      <TableRow>
                        <TableCell>ข้อบ่งใช้</TableCell>
                        <TableCell>NOAC</TableCell>
                        <TableCell>ขนาดยาที่แนะนำ</TableCell>
                        <TableCell>Reference</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell rowSpan={4}>1. AF</TableCell>
                        <TableCell>Dabigatran</TableCell>
                        <TableCell>150 mg BID</TableCell>
                        <TableCell>2024 ESC guideline (1)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rivaroxaban</TableCell>
                        <TableCell>20 mg OD</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Apixaban</TableCell>
                        <TableCell>5 mg BID</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Edoxaban</TableCell>
                        <TableCell>60 mg OD</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell rowSpan={4}>2. DVT/PE</TableCell>
                        <TableCell>Dabigatran</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rivaroxaban</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Apixaban</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Edoxaban</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Collapse>
          </Card>

          {/* Collapsible Section 2 */}
          <Card className='my-2'>
            <CardHeader
              title='2. ข้อห้ามใช้ยา'
              className='border-l-8  border-primary cursor-pointer hover:bg-gray-100'
              onClick={() => setOpen2(!open2)}
            >
              <IconButton sx={{ transform: open1 ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                {'>'}
              </IconButton>
            </CardHeader>
            <Collapse in={open2} timeout='auto' unmountOnExit>
              <Divider />
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead className='bg-primary'>
                      <TableRow>
                        <TableCell>NOAC</TableCell>
                        <TableCell>ข้อห้ามใช้ยา</TableCell>
                        <TableCell>ผลประเมิน</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Dabigatran rows */}
                      <TableRow>
                        <TableCell rowSpan={3}>Dabigatran</TableCell>
                        <TableCell>CrCL &lt; 15 mL/min</TableCell>
                        <TableCell>ไม่พบ</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dialysis</TableCell>
                        <TableCell>ไม่พบ</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>ยาที่ห้ามใช้ร่วมกัน</TableCell>
                        <TableCell>ไม่พบ</TableCell>
                      </TableRow>

                      {/* Rivaroxaban row */}
                      <TableRow>
                        <TableCell>Rivaroxaban</TableCell>
                        <TableCell>Child-Pugh C</TableCell>
                        <TableCell>ไม่พบ</TableCell>
                      </TableRow>

                      {/* Apixaban row */}
                      <TableRow>
                        <TableCell>Apixaban</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>

                      {/* Edoxaban row */}
                      <TableRow>
                        <TableCell>Edoxaban</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Collapse>
          </Card>

          {/* Collapsible Section 3 */}
          <Card className='my-2'>
            <CardHeader
              title='3. การเกิดอันตรายระหว่างยา'
              className='border-l-8 border-primary hover:bg-gray-100 cursor-pointer'
              onClick={() => setOpen3(!open3)}
            />
            <Collapse in={open3} timeout='auto' unmountOnExit>
              <Divider />
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead className='bg-primary'>
                      <TableRow>
                        <TableCell>ยาที่ใช้ร่วมกัน</TableCell>
                        <TableCell>วันที่สั่งจ่ายย้อนหลัง 3 เดือน</TableCell>
                        <TableCell>NOAC ที่ใช้ร่วม</TableCell>
                        <TableCell>ผลการประเมิน</TableCell>
                        <TableCell>คำแนะนำ</TableCell>
                        <TableCell>ยาทางเลือก</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Ketoconazole rows */}
                      <TableRow>
                        <TableCell rowSpan={4}>ketoconazole</TableCell>
                        <TableCell rowSpan={4}>20/10/2567</TableCell>
                        <TableCell>Dabigatran</TableCell>
                        <TableCell>Contraindication</TableCell>
                        <TableCell>ห้ามใช้ร่วมกัน</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rivaroxaban</TableCell>
                        <TableCell>Contraindication</TableCell>
                        <TableCell>ห้ามใช้ร่วมกัน</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Apixaban</TableCell>
                        <TableCell>Contraindication</TableCell>
                        <TableCell>ห้ามใช้ร่วมกัน</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Edoxaban</TableCell>
                        <TableCell>Contraindication</TableCell>
                        <TableCell>ห้ามใช้ร่วมกัน</TableCell>
                        <TableCell></TableCell>
                      </TableRow>

                      {/* Clopidogrel rows */}
                      <TableRow>
                        <TableCell rowSpan={4}>clopidogrel</TableCell>
                        <TableCell rowSpan={4}>10/09/2567</TableCell>
                        <TableCell>Dabigatran</TableCell>
                        <TableCell>caution</TableCell>
                        <TableCell>ระมัดระวัง</TableCell>
                        <TableCell>ติดตามอาการเกิดภาวะเลือดออก</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rivaroxaban</TableCell>
                        <TableCell>caution</TableCell>
                        <TableCell>ระมัดระวัง</TableCell>
                        <TableCell>ติดตามอาการเกิดภาวะเลือดออก</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Apixaban</TableCell>
                        <TableCell>caution</TableCell>
                        <TableCell>ระมัดระวัง</TableCell>
                        <TableCell>ติดตามอาการเกิดภาวะเลือดออก</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Edoxaban</TableCell>
                        <TableCell>caution</TableCell>
                        <TableCell>ระมัดระวัง</TableCell>
                        <TableCell>ติดตามอาการเกิดภาวะเลือดออก</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Collapse>
          </Card>
        </CardContent>
      </Card>
      {/* Collapsible Section 1 */}
    </div>
  )
}

export default ConsultDetail
