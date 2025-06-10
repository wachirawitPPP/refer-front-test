import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Avatar,
  MenuItem,
  Autocomplete,
  TextField
} from '@mui/material'
import axios from 'axios'
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import { useSession } from 'next-auth/react'
import { toast, Flip } from 'react-toastify'

const UserSettingModal = ({ title, user, onChange, onSave, open, onClose, isEdit, department }) => {
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

  const { data: session } = useSession()
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({
    username: false,
    name: false,
    email: false,
    role: false,
    department: false,
    password: false
  })

  useEffect(() => {
    if (open) {
      setErrors({
        username: false,
        name: false,
        email: false,
        role: false,
        department: false,
        password: false
      })

      if (isEdit) {
        setFormData({
          ...user,
          password: '', // reset password field when editing
          imageFile: null
        })
      } else {
        setFormData(initialFormData)
      }
    }
  }, [open, isEdit, user])

  const handleImageChange = e => {
    const file = e.target.files[0]
    console.log(file)
    if (file) {
      setFormData(prevFormData => ({ ...prevFormData, image: file }))
    }
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const validateForm = () => {
    const tempErrors = {
      username: !formData.username,
      name: !formData.name,
      email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
      role: !formData.role,
      department: !formData.departmentId,
      password: !formData.password
    }
    setErrors(tempErrors)
    return !Object.values(tempErrors).includes(true)
  }

  const uploadImage = async (imagePath, file, token) => {
    const avatar = new FormData()
    avatar.append('avatar', file)
    avatar.append('path', imagePath)
    avatar.append('s3Path', 'user')

    console.log(avatar)

    const response = await axios.post(`${process.env.NEXT_PUBLIC_TEST_API_URL}/upload`, avatar, {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) return

    const findDept = async id => {
      const dept = department.departments.find(dept => dept.id === id)
      return dept ? dept.name : null
    }

    const departmentName = await findDept(formData.departmentId)
    console.log(departmentName)

    const data = {
      ...formData,
      hospitalId: session.user.hospitalId,

      departmentName: departmentName
    }

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
      //console.log(data)

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_TEST_API_URL}/user/${user.id}`
        : `${process.env.NEXT_PUBLIC_TEST_API_URL}/user`
      const method = isEdit ? 'put' : 'post'

      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${session.user.token}`
        }
      })

      if (response.data.message === 'User updated successfully') {
        toast.success('อัพเดตข้อมูลสำเร็จ', {
          position: 'top-right',
          autoClose: 5000, // 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false
        })
        onSave()
        onClose();
      }

      //console.log(response.data)

      
    } catch (error) {
      console.error('There was an error uploading the data!', error)
    }
  }

  const roleOptions = [
    { label: 'referDoctor', value: 'referDoctor' },
    { label: 'แพทย์', value: 'doctor' },
    { label: 'พยาบาล', value: 'nurse' }
  ]

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose()
        }
      }}
      maxWidth='lg'
    >
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers className='gap-4'>
          <Grid container spacing={4}>
            <Grid item xs={12} display='flex' justifyContent='center'>
              <Avatar src={formData.image} alt={formData.name} sx={{ width: 100, height: 100 }} />
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='center'>
              <Button variant='contained' component='label'>
                Upload Image
                <input type='file' hidden accept='image/*' onChange={handleImageChange} />
              </Button>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                id='username'
                label='ชื่อผู้ใช้'
                placeholder='ชื่อผู้ใช้'
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
                error={errors.email}
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
                error={errors.department}
              >
                {department.departments.map(dept => (
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

export default UserSettingModal
