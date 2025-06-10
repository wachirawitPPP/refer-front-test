'use client'
import React, { useEffect, useState } from 'react';
import {
  Grid,
  ListItem,
  Box
} from '@mui/material';
import CustomTextField from '@/@core/components/mui/TextField';
import CustomAutocomplete from '@core/components/mui/Autocomplete';

import {
  Avatar,
  Typography,
  Button
} from '@mui/material/';



import optionsData from '@/data/inputSelectOptions.json';
import provinces from '@/data/thai_provinces.json';
import amphurs from '@/data/thai_amphures.json';
import tambons from '@/data/thai_tambons.json';

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';
import axios from 'axios';
import { useSession } from 'next-auth/react';

// Third-party Imports

import { useDropzone } from 'react-dropzone';

const getHn = async (token) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/generate-hn`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    return res.data;
  } catch (error) {
    console.error(error)
    return 'Error generating HN'
  }
}

const getHnPrefix = async (token, hospitalId) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/hospital-info/${hospitalId}`, {
      headers: {
        'Authorization': `${token}`
      }
    });

    return res.data.data.HNCode;
  } catch (error) {
    console.error(error);
    return 'Error generating HN';
  }
};

export default function AddNewUser({ formData, setFormData, sendData }) {

  // States
  const [files, setFiles] = useState([]);
  const [amphurOptions, setAmphurOptions] = useState([]);
  const [tambonOptions, setTambonOptions] = useState([]);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [idCard, setIdCard] = useState('');
  const [isValidIdCard, setIsValidIdCard] = useState(true);
  const { data: session, status } = useSession();
  const [hnPrefix, setHnPrefix] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(formData.file);
  const [imageUrl, setImageUrl] = useState('');

  const findProvince = (id) => provinces.find(province => province.id === id);
  const findAmphur = (id) => amphurs.find(amphur => amphur.id === id);
  const findTambon = (id) => tambons.find(tambon => tambon.id === id);


  const getImageAuthen =  async (path) =>{
   
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/getfileupload`, {
        params: { file_name: path },
        headers: {
          Authorization: `${session.user?.token}`
        }
      });
      console.log(response.data.img)
      return response.data.img.toString();  // คืนค่า URL ใหม่ที่มีโทเคน
    } catch (error) {
      console.error('Fetch image token failed:', error);
      return path;  // หากมีข้อผิดพลาด ให้ใช้ URL เดิม
    }
  }

  useEffect(() => {
    // Fetch the image only when formData.filePath exists
    if (formData.filePath) {
      const fetchImage = async () => {
        const img = await getImageAuthen(formData.filePath, session);
        setPreviewUrl(img);
      };
      fetchImage();
    }
  }, [formData.filePath, session]);


  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        if (session && session.user.token) {
          try {
            const hnCode = await getHn(session.user.token);
            setFormData((prevData) => ({
              ...prevData,
              hn: formData.hn ? formData.hn : hnCode.hnCode,
              province: findProvince(formData.provinceId),
              amphur: findAmphur(formData.amphurId),
              tambon: findTambon(formData.tambonId),

            }));

          } catch (error) {
            console.log(error);
          }

          try {
            const prefix = await getHnPrefix(session.user.token, session.user.hospitalId);
            setHnPrefix(prefix);
          } catch (error) {
            console.log(error);
          }
        }
      };

      fetchData();
    }

    setFiles([formData.file]);
  }, [status, session, setFormData, formData.hn, formData.file]);

  useEffect(() => {
    if (formData.province) {
      const filteredAmphurs = amphurs.filter(item => item.province_id === formData.province.id);
      setAmphurOptions(filteredAmphurs.map(item => ({
        id: item.id,
        title: item.name_th
      })));
    } else {
      setAmphurOptions([]);
      setFormData(prevData => ({ ...prevData, amphur: null, tambon: null, zipCode: '' }));
    }
  }, [formData.province]);
  useEffect(() => {
    if (formData.amphur) {
      const filteredTambons = tambons.filter(item => item.amphure_id === formData.amphur.id);
      setTambonOptions(filteredTambons.map(item => ({
        id: item.id,
        title: item.name_th
      })));
    } else {
      setTambonOptions([]);
      setFormData(prevData => ({ ...prevData, tambon: null, zipCode: '' }));
    }
  }, [formData.amphur]);

  useEffect(() => {
    if (formData.tambon) {
      const selectedTambon = tambons.find(item => item.id === formData.tambon.id);
      setFormData(prevData => ({ ...prevData, zipCode: selectedTambon?.zip_code.toString() || '' }));
    } else {
      setFormData(prevData => ({ ...prevData, zipCode: '' }));
    }
  }, [formData.tambon]);

  const handleProvinceChange = (event, value) => {
    setFormData(prevData => ({
      ...prevData,
      province: value,
      amphur: null,
      tambon: null,
      zipCode: ''
    }));
    if (value) {
      const filteredAmphurs = amphurs.filter(item => item.province_id === value.id);
      setAmphurOptions(filteredAmphurs.map(item => ({
        id: item.id,
        title: item.name_th
      })));
    } else {
      setAmphurOptions([]);
      setTambonOptions([]);
    }
  };
  
  const handleAmphurChange = (event, value) => {
    setFormData(prevData => ({
      ...prevData,
      amphur: value,
      tambon: null,
      zipCode: ''
    }));

    const filteredTambons = tambons.filter(item => item.amphure_id === value.id);
    setTambonOptions(filteredTambons.map(item => ({
      id: item.id,
      title: item.name_th
    })));

  };

  const handleTambonChange = (event, value) => {
    setFormData(prevData => ({
      ...prevData,
      tambon: value,
      zipCode: value ? value.zipCode : ''
    }));
  };

  // Hooks
  const { getRootProps, getInputProps, open } = useDropzone({
    multiple: false,
    accept: 'image/*',
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      setFiles([file]);
      setFormData(prevData => ({
        ...prevData,
        file: file, // Store the file directly
      }));
    },
    noClick: true, // Prevents the default click behavior of opening the file dialog
  });



  const handleUpload = () => {
    open();
  }

  const handleEmailChange = (e) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(regex.test(value));
    setFormData((prevData) => ({
      ...prevData,
      email: regex.test(value) ? value : '',
    }));
  }

  const handlePhoneNumberChange = (e) => {
    const regex = /^0\d{8,12}$/;
    const value = e.target.value;
    setPhoneNumber(value);
    setIsValidPhone(regex.test(value));
    setFormData((prevData) => ({
      ...prevData,
      tel: regex.test(value) ? value : '',
    }));
  };

  const handleIdCardChange = (e) => {
    const regex = /^\d{13}$/;
    const value = e.target.value;
    setIdCard(value);
    setIsValidIdCard(regex.test(value));
    setFormData((prevData) => ({
      ...prevData,
      idCardNumber: regex.test(value) ? value : '',
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
      birthDate: date ? date.toISOString() : '',
    }));
  };
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFiles(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setFormData((prevData) => ({
        ...prevData,
        file: selectedFile,
      }));
      // uploadImage(selectedFile);
    }
  };

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



  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} lg={3}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
          <Avatar
            variant="rounded"
            src={previewUrl}
            alt={formData.firstnameTH}
            sx={{ width: 120, height: 120, mb: 3 }}
          />
          <Button
            variant="contained"
            component="label"
            size="small"
          // sx={{ width: 100, height: 50 }}
          >
            อัปโหลดรูปภาพ
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </Box>
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
        <CustomTextField name='idCardNumber' value={isValidIdCard ? formData.idCardNumber : idCard} fullWidth label='เลขบัตรประชาชน' placeholder='เลขบัตรประชาชน' onChange={handleIdCardChange} required error={!formData.idCardNumber && sendData} />
        {!isValidIdCard && idCard && (
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
          showYearDropdown
          showMonthDropdown
          placeholderText='วันเกิด'
          name='birthDate'
          required
          customInput={<CustomTextField label='วันเกิด' fullWidth error={!formData.birthDate && sendData} />}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField disabled fullWidth label='รหัส HN' placeholder='รหัส HN' name='hn' required onChange={handleChange} value={hnPrefix + formData.hn || ''} error={!formData.hn && sendData} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField disabled fullWidth label='รหัส HN เดิม' placeholder='รหัส HN' name='hn' />
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
        <CustomTextField fullWidth label='เบอร์โทรศัพท์' placeholder='เบอร์โทร' name='tel' onChange={handlePhoneNumberChange} value={isValidPhone ? formData.tel : phoneNumber} />
        {!isValidPhone && phoneNumber && (
          <span style={{ color: 'red' }}>กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง!</span>
        )}
      </Grid>

      <Grid item xs={12} sm={6} lg={6}>
        <CustomTextField fullWidth label='ที่อยู่' placeholder='ที่อยู่' required name='address' onChange={handleChange} value={formData.address || ''} error={!formData.address && sendData} />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomAutocomplete
          fullWidth
          options={provinceOption}
          value={provinceOption.find(option => option.id === formData.province?.id) || null}
          onChange={handleProvinceChange}
          getOptionLabel={option => option.title}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderInput={(params) => <CustomTextField {...params} placeholder='จังหวัด' label='จังหวัด' />}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomAutocomplete
          fullWidth
          options={amphurOptions}
          value={amphurOptions.find(option => option.id === formData.amphur?.id) || null}
          onChange={handleAmphurChange}
          getOptionLabel={option => option.title}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderInput={(params) => <CustomTextField {...params} placeholder='อำเภอ' label='อำเภอ' />}
          disabled={!formData.province}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomAutocomplete
          fullWidth
          options={tambonOptions}
          value={tambonOptions.find(option => option.id === formData.tambon?.id) || null}
          onChange={handleTambonChange}
          getOptionLabel={option => option.title}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderInput={(params) => <CustomTextField {...params} placeholder='ตำบล' label='ตำบล' />}
          disabled={!formData.amphur}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CustomTextField name='zipCode' fullWidth label='รหัสไปรษณีย์' placeholder='รหัสไปรษณีย์' value={formData.zipCode} required disabled={true} error={!formData.zipCode && sendData} />
      </Grid>
      <Grid item xs={12} sm={6} lg={6}>
        <CustomTextField name='note' fullWidth label='หมายเหตุ' placeholder='หมายเหตุ' onChange={handleChange} value={formData.note || ''} />
      </Grid>
    </Grid>
  );
}
