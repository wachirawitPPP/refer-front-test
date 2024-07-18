'use client'
import React, { useEffect, useState } from 'react';
import {
  Grid,
  ListItem,
} from '@mui/material';
import CustomTextField from '@/@core/components/mui/TextField';
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import Typography from '@mui/material/Typography'

import optionsData from '@/data/inputSelectOptions.json'
import provinces from '@/data/thai_provinces.json'
import amphurs from '@/data/thai_amphures.json'
import tambons from '@/data/thai_tambons.json'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Third-party Imports

import Avatar from '@mui/material/Avatar'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

export default function AddNewUser({ formData, setFormData, sendData }) {
  // States
  const [files, setFiles] = useState([])
  // const [date, setDate] = useState()
  const [aumphure, setAumphures] = useState([...amphurs])
  const [tambon, setTambon] = useState([...tambons])
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [idCard, setIdCard] = useState('');
  const [isValidIdCard, setIsValidIdCard] = useState(true);
  // console.log(formData)

  useEffect(() => {
    setFiles[formData.file]
  }, [setFiles]);

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
      setFormData((prevData) => ({
        ...prevData,
        file: acceptedFiles.map(file => Object.assign(file)),
      }))
    },
  })


  const renderFilePreview = file => {

    if (file.type.startsWith('image')) {
      // test edit
      return <div className="container" onClick={handleRemoveAllFiles}>
        <img width={100} height={100} alt={file.name} src={URL.createObjectURL(file)} className='testImg' />
        <div className="middle">
          <i className='tabler-trash text-[22px] textRemove' style={{ color: 'red' }} />
        </div>
      </div>
      // return <img width={75} height={75} alt={file.name} src={URL.createObjectURL(file)} />

    } else {
      return <i className='tabler-file-description' />
    }
  }

  const handleRemoveAllFiles = () => {
    setFiles([])
    setFormData((prevData) => ({
      ...prevData,
      file: [],
    }))
  }

  const prefixOption = optionsData.prefix.map((item, index) => ({
    id: `${index + 1}`,
    title: item
  }));
  const genderOption = optionsData.gender.map((item, index) => ({
    id: `${index + 1}`,
    title: item
  }));
  const nationOption = optionsData.nation.map((item, index) => ({
    id: `${index + 1}`,
    title: item
  }));
  const religionOption = optionsData.religion.map((item, index) => ({
    id: `${index + 1}`,
    title: item
  }));
  const educationOption = optionsData.education.map((item, index) => ({
    id: `${index + 1}`,
    title: item
  }));
  const maritalOption = optionsData.marital.map((item, index) => ({
    id: `${index + 1}`,
    title: item
  }));
  const bloodOption = optionsData.blood.map((item, index) => ({
    id: `${index + 1}`,
    title: item
  }));

  const provinceOption = provinces.map((item) => ({
    id: item.id,
    title: item.name_th
  }));

  function onchangeProvince(id, value) {
    const filteredAumphures = amphurs.filter(item => item.province_id === id);
    setAumphures(filteredAumphures);
    setFormData((prevData) => ({
      ...prevData,
      province: value,
      amphur: '',
      tambon: '',
      zipCode: '',
    }))
  }

  const aumphureOption = aumphure.map((item) => ({
    id: item.id,
    title: item.name_th
  }));

  function onchangeAumphures(id, value) {
    const filteredTambon = tambons.filter(item => item.amphure_id === id);
    setTambon(filteredTambon);
    setFormData((prevData) => ({
      ...prevData,
      amphur: value,
      tambon: '',
      zipCode: ''
    }))
  }

  const tambonOption = tambon.map((item) => ({
    id: item.id,
    title: item.name_th
  }));

  function onchangeTambons(id, value) {
    const forZipCode = tambons.find(item => item.id === id);
    setFormData((prevData) => ({
      ...prevData,
      tambon: value,
      zipCode: forZipCode?.zip_code.toString(),
    }))
  }

  const handleEmailChange = (e) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(regex.test(value));
      setFormData((prevData) => ({
        ...prevData,
        email: regex.test(value) ? value :'',
      }));
  }

  const handlephoneNumberChange = (e) => {
    const regex = /^0\d{8,12}$/;
    const value = e.target.value;
    setPhoneNumber(value);
    setIsValidPhone(regex.test(value));
    setFormData((prevData) => ({
      ...prevData,
      tel: regex.test(value) ? value :'',
    }));
  };

  const handleIdcardChange = (e) => {
    const regex = /^\d{13}$/;
    const value = e.target.value;
    setIdCard(value);
    setIsValidIdCard(regex.test(value));
    setFormData((prevData) => ({
      ...prevData,
      idCardNumber: regex.test(value) ? value :'',
    }));
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAutocompleteChange = (event, value, name) => {
    setFormData((prevData) => ({ ...prevData, [name]: value ? value.title : '' }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      birthDate: date ? date.toISOString(): '',
    }));
    console.log(formData.birthDate)
  };

  return (
    <Grid container spacing={4} >
      <Grid item xs={12} sm={6} lg={3}>
        <div style={{ textAlign: 'center' }}>
          {files.length ? (
            <>
              <Grid container justifyContent="center" alignItems="center">
                {files.map(file => (
                  <Grid item xs={12} key={file.name}>
                    <ListItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className='file-details' style={{ textAlign: 'center' }}>
                        <div className='file-preview' >{renderFilePreview(file)}</div>
                        {/* <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                          Remove
                        </Button> */}
                      </div>
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
            </>
          ) :
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <div className='flex items-center flex-col'>
                <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                  <i className='tabler-upload' />
                </Avatar>
                <Typography>Allowed *.jpeg, *.jpg, *.png </Typography>
              </div>
            </div>
          }

        </div>
      </Grid>
      <Grid item xs={12} sm={6} lg={3} className='space-y-3'>
        <CustomAutocomplete
          fullWidth
          options={prefixOption}
          id='prefixOption'
          name='title'
          getOptionLabel={option => option.title || ''}
          value={prefixOption.find(option => option.title === formData.title) || null}
          onChange={(event, value) => handleAutocompleteChange(event, value, 'title')}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderInput={params => <CustomTextField placeholder='คำนำหน้า' {...params} label='คำนำหน้า' required error={!formData.title && sendData} />}
        />
        <CustomAutocomplete
          fullWidth
          options={genderOption}
          id='genderOption'
          name='gender'
          getOptionLabel={option => option.title || ''}
          value={genderOption.find(option => option.title === formData.gender) || null}
          onChange={(event, value) => handleAutocompleteChange(event, value, 'gender')}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderInput={params => (
            <CustomTextField
              placeholder='เพศ'
              {...params}
              label='เพศ'
              required
              error={!formData.gender && sendData}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3} className='space-y-3'>
        <CustomAutocomplete
          fullWidth
          options={nationOption}
          id='nationOption'
          name='nationality'
          getOptionLabel={option => option.title || ''}
          value={nationOption.find(option => option.title === formData.nationality) || null}
          onChange={(event, value) => handleAutocompleteChange(event, value, 'nationality')}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderInput={params => <CustomTextField placeholder='สัญชาติ'{...params} label='สัญชาติ' error={!formData.nationality && sendData} />}
        />
        <CustomAutocomplete
          fullWidth
          name='religion'
          options={religionOption}
          id='religionOption'
          getOptionLabel={option => option.title || ''}
          value={religionOption.find(option => option.title === formData.religion) || null}
          onChange={(event, value) => handleAutocompleteChange(event, value, 'religion')}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderInput={params => <CustomTextField placeholder='ศาสนา' {...params} label='ศาสนา' required error={!formData.religion && sendData} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3} className='space-y-3'>
        <CustomAutocomplete
          fullWidth
          name='education'
          options={educationOption}
          id='educationOption'
          getOptionLabel={option => option.title || ''}
          value={educationOption.find(option => option.title === formData.education) || null}
          onChange={(event, value) => handleAutocompleteChange(event, value, 'education')}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderInput={params => <CustomTextField placeholder='ระดับการศึกษา' {...params} label='ระดับการศึกษา' required error={!formData.education && sendData} />}
        />
        <CustomAutocomplete
          fullWidth
          name='maritalOption'
          options={maritalOption}
          id='maritalOption'
          getOptionLabel={option => option.title || ''}
          value={maritalOption.find(option => option.title === formData.maritalOptions) || null}
          onChange={(event, value) => handleAutocompleteChange(event, value, 'maritalOptions')}
          isOptionEqualToValue={(option, value) => option.id === value?.id}

          renderInput={params => <CustomTextField placeholder='สถานะภาพสมรส' {...params} label='สถานะภาพสมรส' required error={!formData.maritalOptions && sendData} />}
        />
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField name='idCardNumber' value={isValidIdCard ? formData.idCardNumber : idCard} fullWidth label='เลขบัตรประชาชน' placeholder='เลขบัตรประชาชน' onChange={handleIdcardChange} required error={!formData.idCardNumber && sendData} />
        {!isValidIdCard && idCard&& (
          <span style={{ color: 'red' }}>กรุณากรอกเลขบัตรประชาชนที่ถูกต้อง!</span>
        )}
      </Grid>
      
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField name='passportNumber' value={formData.passportNumber || ''} fullWidth label='หนังสือเดินทาง' placeholder='หนังสือเดินทาง' onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomAutocomplete
          fullWidth
          name='bloodtype'
          options={bloodOption}
          id='bloodOption'
          getOptionLabel={option => option.title || ''}
          value={bloodOption.find(option => option.title === formData.bloodtype) || null}
          onChange={(event, value) => handleAutocompleteChange(event, value, 'bloodtype')}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderInput={params => <CustomTextField placeholder='กรุ๊ปเลือด' {...params} label='กรุ๊ปเลือด' required error={!formData.bloodtype && sendData} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <AppReactDatepicker
          selected={formData.birthDate}
          id='birthDate-input'
          onChange={handleDateChange}
          // dateFormat='dd/MM/YYYY'
          showYearDropdown
          showMonthDropdown
          placeholderText='วันเกิด'
          name='birthDate'
          required
          customInput={<CustomTextField label='วันเกิด' fullWidth error={!formData.birthDate && sendData} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField fullWidth label='รหัส HN' placeholder='รหัส HN' name='hn' required onChange={handleChange} value={formData.hn || ''} error={!formData.hn && sendData} />
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField fullWidth label='ชื่อ' placeholder='ชื่อ' name='firstnameTH' required onChange={handleChange} value={formData.firstnameTH || ''} error={!formData.firstnameTH && sendData} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField fullWidth label='นามสกุล' placeholder='นามสกุล' name='lastnameTH' required onChange={handleChange} value={formData.lastnameTH || ''} error={!formData.lastnameTH && sendData} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField fullWidth label='ชื่อเล่น' placeholder='ชื่อเล่น' name='nickname' onChange={handleChange} value={formData.nickname || ''} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField fullWidth label='แท็ก' placeholder='แท็ก' name='tag' onChange={handleChange} value={formData.tag || ''} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField fullWidth label='ชื่อ (EN)' placeholder='ชื่อ (EN)' name='firstnameEN' onChange={handleChange} value={formData.firstnameEN || ''} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField fullWidth label='นามสกุล (EN)' placeholder='นามสกุล (EN)' name='lastnameEN' onChange={handleChange} value={formData.lastnameEN || ''} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField fullWidth label='อีเมล' placeholder='อีเมล' name='email' onChange={handleEmailChange} value={isValidEmail ? formData.email : email} />
        {!isValidEmail && email && (
          <span style={{ color: 'red' }}>กรุณากรอกอีเมลที่ถูกต้อง!</span>
        )}
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField fullWidth label='เบอร์โทรศัพท์' placeholder='เบอร์โทร' name='tel' onChange={handlephoneNumberChange} value={isValidPhone ? formData.tel : phoneNumber} />
        {!isValidPhone && phoneNumber&& (
          <span style={{ color: 'red' }}>กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง!</span>
        )}
      </Grid>

      <Grid item xs={12} sm={6} lg={6}>
        <CustomTextField fullWidth label='ที่อยู่' placeholder='ที่อยู่' required name='address' onChange={handleChange} value={formData.address || ''} error={!formData.address && sendData} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomAutocomplete
          fullWidth
          disableClearable={true}
          options={provinceOption}
          onChange={(event, value) => onchangeProvince(value.id, value.title)}
          id='provinceOption'
          name='province'
          getOptionLabel={(option) => option.title || ''}
          value={provinceOption.find(option => option.title === formData.province) || null}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              placeholder='จังหวัด'
              label='จังหวัด'
              required
              error={!formData.province && sendData}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomAutocomplete
          fullWidth
          disableClearable={true}
          options={aumphureOption}
          onChange={(event, value) => onchangeAumphures(value.id, value.title)}
          id='aumphureOption'
          name='amphur'
          getOptionLabel={option => option.title || ''}
          disabled={!formData.province}
          value={aumphureOption.find(option => option.title === formData.amphur) || null}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderInput={params => <CustomTextField placeholder={formData.amphur || 'อำเภอ'} {...params} label='อำเภอ' required error={!formData.amphur && sendData} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomAutocomplete
          fullWidth
          disableClearable={true}
          onChange={(event, value) => onchangeTambons(value.id, value.title)}
          options={tambonOption}
          disabled={!formData.amphur}
          id='tambonOption'
          name='tambon'
          getOptionLabel={option => option.title || ''}
          value={tambonOption.find(option => option.title === formData.tambon) || null}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderInput={params => <CustomTextField placeholder={formData.tambon || 'ตำบล'} {...params} label='ตำบล' required error={!formData.tambon && sendData} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField name='zipCode' fullWidth label='รหัสไปรษณีย์' placeholder='รหัสไปรษณีย์' value={formData.zipCode} required disabled={true} error={!formData.zipCode && sendData} />
      </Grid>
      <Grid item xs={12} sm={6} lg={6}>
        <CustomTextField name='note' fullWidth label='หมายเหตุ' placeholder='หมายเหตุ' onChange={handleChange} value={formData.note || ''} />
      </Grid>
    </Grid>

  )
}