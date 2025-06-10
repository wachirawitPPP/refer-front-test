'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'

// Components Imports
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'
import { toast, Flip } from 'react-toastify'

// Data Imports
import provinces from '@/data/thai_provinces.json'
import amphurs from '@/data/thai_amphures.json'
import tambons from '@/data/thai_tambons.json'
import axios from 'axios';
import { useSession } from 'next-auth/react'
import { Form } from 'react-hook-form'


const HospitalForms = ({ data,loading }) => {

  const findProvince = (id) => provinces.find(province => province.id === id);
  const findAmphur = (id) => amphurs.find(amphur => amphur.id === id);
  const findTambon = (id) => tambons.find(tambon => tambon.id === id);

  // Initialize state
  const [formData, setFormData] = useState({
    name: data.name,
    email: data.email,
    phone: data.phone,
    province: findProvince(data.provinceId),
    amphur: findAmphur(data.amphurId),
    tambon: findTambon(data.tambonId),
    zipCode: data.zipCode,
    serviceDesc: data.serviceDesc,
    liscenseNumber: data.licenseNumber,
    hospitalCode: data.hospitalCode,
    address: data.address,
    image: data.image,
    referCode: data.referCode,
    HNCode: data.HNCode,
    filePath: data.filePath,
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    province: false,
    amphur: false,
    tambon: false,
    zipCode: false,
    serviceDesc: false,
    liscenseNumber: false,
    hospitalCode: false,
    address: false,
    referCode: false,
    HNCode: false,
  });

  const [amphurOptions, setAmphurOptions] = useState([]);
  const [tambonOptions, setTambonOptions] = useState([]);
  const [file, setFile] = useState([]);
  const { data: session, status } = useSession();

  const provinceOptions = provinces.map((item) => ({
    id: item.id,
    title: item.name_th
  }));

  const validatePhoneNumber = (phoneNumber) => /^[0-9]{9,10}$/.test(phoneNumber);

  const validateForm = () => {
    const tempErrors = {
      name: !formData.name,
      email: !formData.email,
      phone: !validatePhoneNumber(formData.phone),
      province: !formData.province,
      amphur: !formData.amphur,
      tambon: !formData.tambon,
      zipCode: !formData.zipCode,
      serviceDesc: !formData.serviceDesc,
      liscenseNumber: !formData.liscenseNumber,
      hospitalCode: !formData.hospitalCode,
      address: !formData.address,
      referCode: !formData.referCode,
      HNCode: !formData.HNCode,
    };
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => !x);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file)
    if (file) {

      setFormData(prevFormData => ({ ...prevFormData, image: file }));


    }

    console.log(formData.image);
  };

  const handleProvinceChange = (event, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
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
    setFormData(prevFormData => ({
      ...prevFormData,
      amphur: value,
      tambon: null,
      zipCode: ''
    }));
    if (value) {
      const filteredTambons = tambons.filter(item => item.amphure_id === value.id);
      setTambonOptions(filteredTambons.map(item => ({
        id: item.id,
        title: item.name_th
      })));
    } else {
      setTambonOptions([]);
    }
  };

  const handleTambonChange = (event, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      tambon: value,
      zipCode: value ? value.zipCode : ''
    }));
  };

  const uploadImage = async (imagePath, file, token) => {
    const avatar = new FormData();
    avatar.append('avatar', file);
    avatar.append('path', imagePath);
    avatar.append('s3Path','user')

    console.log(avatar);

    const response = await axios.post(`${process.env.NEXT_PUBLIC_TEST_API_URL}/upload`, avatar, {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalForm = {

      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      province: formData.province.title,
      provinceId: formData.province.id,
      amphur: formData.amphur.title,
      amphurId: formData.amphur.id,
      tambon: formData.tambon.title,
      tambonId: formData.tambon.id,
      zipCode: formData.zipCode,
      serviceDesc: formData.serviceDesc,
      licenseNumber: formData.liscenseNumber,
      hospitalCode: formData.hospitalCode,
      address: formData.address,
      image: formData.image,
      referCode: formData.referCode,
      HNCode: formData.HNCode,
      filePath:''

    };
    console.log(finalForm)

    if (formData.image instanceof File) {
      try {
        const image = await uploadImage(formData.filePath, formData.image, session.user.token)
        console.log(image)
        finalForm.image = image.data.authUrl
        finalForm.filePath = image.data.fileUrl;

      } catch (err) {
        console.error(err);
        toast.error('Failed to upload image');
        
        return;
      }

    }


    try {
      await axios.put(`${process.env.NEXT_PUBLIC_TEST_API_URL}/hospital-info/${session.user.hospitalId}`, finalForm, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${session.user.token}`
        },
      });
      toast.success('บันทึกข้อมูลสำเร็จ', {
        position: 'top-right',
        autoClose: 5000,
        transition: Flip,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (formData.province) {
      const filteredAmphurs = amphurs.filter(item => item.province_id === formData.province.id);
      setAmphurOptions(filteredAmphurs.map(item => ({
        id: item.id,
        title: item.name_th
      })));
    } else {
      setAmphurOptions([]);
      setFormData(prevFormData => ({ ...prevFormData, amphur: null, tambon: null, zipCode: '' }));
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
      setFormData(prevFormData => ({ ...prevFormData, tambon: null, zipCode: '' }));
    }
  }, [formData.amphur]);

  useEffect(() => {
    if (formData.tambon) {
      const selectedTambon = tambons.find(item => item.id === formData.tambon.id);
      setFormData(prevFormData => ({ ...prevFormData, zipCode: selectedTambon?.zip_code.toString() || '' }));
    } else {
      setFormData(prevFormData => ({ ...prevFormData, zipCode: '' }));
    }
  }, [formData.tambon]);

  return (
    <Card>
      <CardHeader title='ข้อมูลโรงพยาบาล' />
      <Divider />
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} display="flex" justifyContent="end">
              <p>UID : {data.id}</p>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar
                src={data.image}
                alt={data.name}
                sx={{ width: 100, height: 100 }}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button
                variant="contained"
                component="label"
              >
                อัปโหลดรูปภาพ
                <input
                  type="file"
                  hidden
                  accept="image/png,image/jpg"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                error={errors.hospitalCode}
                label='รหัสโรงพยาบาล'
                value={formData.hospitalCode}
                placeholder='รหัสโรงพยาบาล'
                onChange={e => setFormData({ ...formData, hospitalCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                label='ชื่อโรงพยาบาล'
                placeholder='ระบุชื่อโรงพยาบาล'
                error={errors.name}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                error={errors.liscenseNumber}
                label='เลขที่ใบอนุญาต'
                value={formData.liscenseNumber}
                placeholder='เลขที่ใบอนุญาต'
                onChange={e => setFormData({ ...formData, liscenseNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                error={errors.serviceDesc}
                label='ลักษณะบริการ'
                value={formData.serviceDesc}
                placeholder='ลักษณะบริการ'
                onChange={e => setFormData({ ...formData, serviceDesc: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                error={errors.phone}
                label='หมายเลขโทรศัพท์'
                value={formData.phone}
                placeholder='หมายเลขโทรศัพท์'
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                type="email"
                error={errors.email}
                label='อีเมล์'
                value={formData.email}
                placeholder='อีเมล์'
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
          </Grid>
          <Divider className='my-6' />
          <p className='mb-4'>2. ข้อมูลที่ตั้ง</p>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={4} lg={2.4}>
              <CustomTextField
                fullWidth
                error={errors.address}
                label='ที่อยู่'
                value={formData.address}
                placeholder='ที่อยู่'
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4} lg={2.4}>
              <CustomAutocomplete
                fullWidth
                options={provinceOptions}
                value={provinceOptions.find(option => option.id === formData.province?.id) || null}
                onChange={handleProvinceChange}
                getOptionLabel={option => option.title}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                renderInput={(params) => <CustomTextField {...params} placeholder='จังหวัด' label='จังหวัด' />}
              />
            </Grid>
            <Grid item xs={12} sm={4} lg={2.4}>
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
            <Grid item xs={12} sm={4} lg={2.4}>
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
            <Grid item xs={12} sm={4} lg={2.4}>
              <CustomTextField disabled fullWidth label='รหัสไปรษณีย์' placeholder='รหัสไปรษณีย์' value={formData.zipCode} />
            </Grid>
          </Grid>
          <Divider className='my-6' />
          <p className='mb-4'>3. ตั้งค่ารหัส</p>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={4} lg={2.4}>
              <CustomTextField
                fullWidth
                error={errors.HNCode}
                label='HN Code'
                value={formData.HNCode}
                placeholder='HN Code'
                onChange={e => setFormData({ ...formData, HNCode: e.target.value })}
              />
              <p className='mt-1'>ตัวอย่าง HN code: {formData.HNCode}00000</p>
            </Grid>
            <Grid item xs={12} sm={4} lg={2.4}>
              <CustomTextField
                fullWidth
                error={errors.referCode}
                label='Refer Code'
                value={formData.referCode}
                placeholder='Refer Code'
                onChange={e => setFormData({ ...formData, referCode: e.target.value })}
              />
              <p className='mt-1'>ตัวอย่าง Refer code: {formData.referCode}00000</p>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions className='justify-end'>
          <Button type='submit' variant="outlined" className='mie-2'>
            บันทึก
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

export default HospitalForms;
