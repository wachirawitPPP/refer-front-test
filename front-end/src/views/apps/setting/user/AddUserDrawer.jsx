// React Imports
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Avatar, Autocomplete, TextField } from '@mui/material'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { toast } from 'react-toastify'
// Vars
const initialData = {
  fullName: '',
  username: '',
  email: '',
  company: '',
  country: '',
  contact: '',
  role: '',
  plan: '',
  status: ''
}

const fetchDepartment = async (token, hospitalId) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/department-by-id/${hospitalId}`, {
      headers: {
        Authorization: `${token}`
      }
    })
    return res.data
  } catch (error) {
    console.error('Failed to fetch department data:', error)
    throw new Error('Failed to fetch department data')
  }
}

const AddUserDrawer = ({ open, handleClose, onClose}) => {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const initialFormData = {
    username: '',
    name: '',
    email: '',
    role: '',
    departmentId: '',
    password: '',
    image: null,
    imageFile: null,
    filePath: ''
  }
  // States
  const [formData, setFormData] = useState(initialData)
  const [department, setDepartment] = useState([])
  // const handleSubmit = e => {
  //   e.preventDefault()
  //   handleClose()
  //   setFormData(initialData)
  //   console.log(formData)
  // }

  const getData = async () => {
    if (session && session.user.token) {
      try {
        setLoading(true)
        const [departmentData] = await Promise.all([fetchDepartment(session.user.token, session.user.hospitalId)])
        //console.log('test department', departmentData)
        setDepartment(departmentData.departments)
        setError(null) // clear any previous errors
      } catch (error) {
        setError(error.message)
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      getData()
    }
  }, [status, session])

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) return

    const findDept = async id => {
      const dept = department.find(dept => dept.id === id)
      return dept ? dept.name : null
    }

    const departmentName = await findDept(formData.departmentId)
    console.log(departmentName)

    const data = {
      ...formData,
      hospitalId: session.user.hospitalId,

      departmentName: departmentName
    }

    console.log(data)
    if (formData.image instanceof File) {
      try {
        const image = await uploadImage(formData.filePath, formData.image, session.user.token)
        console.log(image)
        data.image = image.data.authUrl
        data.filePath = image.data.fileUrl
      } catch (error) {
        console.error(error)
        toast.error('Failed to upload image')
      }
    }

    try {
      console.log(data)

      // const url = isEdit
      //   ? `${process.env.NEXT_PUBLIC_TEST_API_URL}/user/${user.id}`
      //   : `${process.env.NEXT_PUBLIC_TEST_API_URL}/user`;
      // const method = isEdit ? 'put' : 'post';

      // const response = await axios({
      //   method,
      //   url,
      //   data,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `${session.user.token}`
      //   },
      // });

      const response = await axios.post(`${process.env.NEXT_PUBLIC_TEST_API_URL}/register`, data, {
        headers: {
          Authorization: `${session.user?.token}`
        }
      })

      if (response.status === 200) {
        toast.warning('มีชื่อผู้ใช้งานในระบบแล้ว!', {
          position: 'top-right',
          autoClose: 5000, // 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false
        })
      } else if (response.data.message === 'User created successfully') {
        toast.success('เพิ่มผู้ใช้งานสำเร็จ', {
          position: 'top-right',
          autoClose: 5000, // 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false
        })

        //onSave() 
        onClose();
      }


    } catch (error) {
      console.error('There was an error uploading the data!', error)
    }
  }

  const [errors, setErrors] = useState({
    username: false,
    name: false,
    //email: false,
    role: false,
    department: false,
    password: false
  })

  const roleOptions = [
    { label: 'ห้องบัตร', value: 'regist' },
    { label: 'แพทย์', value: 'doctor' },
    { label: 'พยาบาล', value: 'nurse' }
  ]

  const handleReset = () => {
    //handleClose()
    setFormData({
      fullName: '',
      username: '',
      email: '',
      company: '',
      country: '',
      contact: '',
      role: '',
      plan: '',
      status: ''
    })
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const validateForm = () => {
    const tempErrors = {
      username: !formData.username,
      name: !formData.name,
      //email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
      role: !formData.role,
      //department: !formData.departmentId,
      password: !formData.password
    }
    setErrors(tempErrors)
    return !Object.values(tempErrors).includes(true)
  }

  return (
    // <Drawer
    //   open={open}
    //   anchor='right'
    //   variant='temporary'
    //   onClose={handleReset}
    //   ModalProps={{ keepMounted: true }}
    //   sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    // >
    //   <div className='flex items-center justify-between plb-5 pli-6'>
    //     <Typography variant='h5'>Add New User</Typography>
    //     <IconButton onClick={handleReset}>
    //       <i className='tabler-x text-textPrimary' />
    //     </IconButton>
    //   </div>
    //   <Divider />
    //   <div>
    //     <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
    //       <CustomTextField
    //         label='Full Name'
    //         fullWidth
    //         placeholder='John Doe'
    //         value={formData.fullName}
    //         onChange={e => setFormData({ ...formData, fullName: e.target.value })}
    //       />
    //       <CustomTextField
    //         label='Username'
    //         fullWidth
    //         placeholder='johndoe'
    //         value={formData.username}
    //         onChange={e => setFormData({ ...formData, username: e.target.value })}
    //       />
    //       <CustomTextField
    //         label='Email'
    //         fullWidth
    //         placeholder='johndoe@gmail.com'
    //         value={formData.email}
    //         onChange={e => setFormData({ ...formData, email: e.target.value })}
    //       />
    //       <CustomTextField
    //         label='Company'
    //         fullWidth
    //         placeholder='Company PVT LTD'
    //         value={formData.company}
    //         onChange={e => setFormData({ ...formData, company: e.target.value })}
    //       />
    //       <CustomTextField
    //         select
    //         fullWidth
    //         id='country'
    //         value={formData.country}
    //         onChange={e => setFormData({ ...formData, country: e.target.value })}
    //         label='Select Country'
    //         inputProps={{ placeholder: 'Country' }}
    //       >
    //         <MenuItem value='UK'>UK</MenuItem>
    //         <MenuItem value='USA'>USA</MenuItem>
    //         <MenuItem value='Australia'>Australia</MenuItem>
    //         <MenuItem value='Germany'>Germany</MenuItem>
    //       </CustomTextField>
    //       <CustomTextField
    //         label='Contact'
    //         type='number'
    //         fullWidth
    //         placeholder='(397) 294-5153'
    //         value={formData.contact}
    //         onChange={e => setFormData({ ...formData, contact: e.target.value })}
    //       />
    //       <CustomTextField
    //         select
    //         fullWidth
    //         id='select-role'
    //         value={formData.role}
    //         onChange={e => setFormData({ ...formData, role: e.target.value })}
    //         label='Select Role'
    //       >
    //         <MenuItem value='admin'>admin</MenuItem>
    //         <MenuItem value='author'>แพทย์</MenuItem>
    //         <MenuItem value='editor'>พยาบาล</MenuItem>
    //         <MenuItem value='maintainer'>Maintainer</MenuItem>
    //         <MenuItem value='subscriber'>Subscriber</MenuItem>
    //       </CustomTextField>
    //       <CustomTextField
    //         select
    //         fullWidth
    //         id='select-plan'
    //         value={formData.plan}
    //         onChange={e => setFormData({ ...formData, plan: e.target.value })}
    //         label='Select Plan'
    //         inputProps={{ placeholder: 'Select Plan' }}
    //       >
    //         <MenuItem value='basic'>Basic</MenuItem>
    //         <MenuItem value='company'>Company</MenuItem>
    //         <MenuItem value='enterprise'>Enterprise</MenuItem>
    //         <MenuItem value='team'>Team</MenuItem>
    //       </CustomTextField>
    //       <CustomTextField
    //         select
    //         fullWidth
    //         id='select-status'
    //         value={formData.status}
    //         onChange={e => setFormData({ ...formData, status: e.target.value })}
    //         label='Select Status'
    //       >
    //         <MenuItem value='pending'>Pending</MenuItem>
    //         <MenuItem value='active'>Active</MenuItem>
    //         <MenuItem value='inactive'>Inactive</MenuItem>
    //       </CustomTextField>
    //       <div className='flex items-center gap-4'>
    //         <Button variant='contained' type='submit'>
    //           Submit
    //         </Button>
    //         <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
    //           Cancel
    //         </Button>
    //       </div>
    //     </form>
    //   </div>
    // </Drawer>

    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose()
        }
      }}
      maxWidth='lg'
    >
      <DialogTitle>เพิ่มผู้ใช้งาน</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers className='gap-4'>
          <Grid container spacing={4}>
            <Grid item xs={12} display='flex' justifyContent='center'>
              <Avatar src={formData.image} alt={formData.name} sx={{ width: 100, height: 100 }} />
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='center'>
              <Button variant='contained' component='label'>
                Upload Image
                <input type='file' hidden accept='image/*' />
              </Button>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                id='username'
                label='ชื่อผู้ใช้'
                placeholder='ชื่อผู้ใช้ //**แนะนำเป็นเลขบัตรประชาชน**//'
                value={formData.username}
                onChange={e => handleChange('username', e.target.value)}
                error={errors.username}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                id='name'
                fullWidth
                label='ชื่อ-นามสกุล'
                placeholder='ชื่อ-นามสกุล'
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                error={errors.name}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                id='email'
                label='อีเมล์'
                placeholder='อีเมล์'
                type='email'
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                // error={errors.email}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomAutocomplete
                id='role'
                fullWidth
                options={roleOptions}
                getOptionLabel={option => option.label}
                value={roleOptions.find(option => option.value === formData.role) || null}
                onChange={(event, newValue) => handleChange('role', newValue ? newValue.value : '')}
                renderInput={params => (
                  <CustomTextField {...params} label='ตำแหน่ง' placeholder='ตำแหน่ง' error={errors.role} />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                select
                id='department'
                label='แผนก / หน่วยงาน'
                placeholder='แผนก / หน่วยงาน'
                value={formData.departmentId}
                onChange={e => handleChange('departmentId', e.target.value)}
                //error={errors.department}
              >
                {department.map(dept => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                id='password'
                fullWidth
                type='password'
                label='รหัสผ่าน'
                placeholder='รหัสผ่าน'
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
                error={errors.password}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='gap-2 mt-4'>
          <Button type='submit' variant='outlined' color='primary'>
            บันทึก
          </Button>
          <Button onClick={onClose} variant='outlined' color='secondary'>
            ยกเลิก
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddUserDrawer
