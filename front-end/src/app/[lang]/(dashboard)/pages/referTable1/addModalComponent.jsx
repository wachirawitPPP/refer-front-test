'use client'

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid
} from '@mui/material';

import Health from './health';
import AddNewUser from './AddNewUser';

// MUI Imports
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';

import { toast } from 'react-toastify';
import ContactInfo from './contactInfo';
import axios from 'axios';

import { useSession } from 'next-auth/react';
import CustomTextField from '@/@core/components/mui/TextField';

const initialFormData = {
  hn: "",
  title: "ไม่ระบุ",
  gender: "ไม่ระบุ",
  nationality: "ไม่ระบุ",
  religion: "ไม่ระบุ",
  education: "ไม่ระบุ",
  maritalOptions: "ไม่ระบุ",
  birthDate: null,
  bloodtype: "ไม่ระบุ",
  idCardNumber: "",
  passportNumber: "",
  firstnameTH: "",
  lastnameTH: "",
  nickname: "",
  firstnameEN: "",
  lastnameEN: "",
  email: "",
  tag: "",
  tel: "",
  address: "",
  province: "",
  amphur: "",
  tambon: "",
  zipCode: "",
  note: "",
  file: "",
  // health
  mainTreatmentRights: "",
  secondaryTreatmentRights: "",
  note2: "",
  drugAllergy: "",
  mentalhealth: "",
  congenitalDisease: "",
  relation: [],
  provinceId: null,
  tambonId: null,
  amphurId: null

  // og_hn: "",
};

const AddUserComponent = ({ modalTitle, open, onClose, selectedUserData, isCreate, onUpdate }) => {
  const [value, setValue] = useState('1');
  const [sendData, setSendData] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false)
  const [idCardNumber, setIdCardNumber] = useState('')
  const [ereferData, setEreferData] = useState()

  useEffect(() => {
    if (modalTitle === 'เพิ่มข้อมูลลูกค้า') {
      setFormData(initialFormData);
    } else {
      setFormData({ ...initialFormData, ...selectedUserData });
    }
  }, [modalTitle, open, selectedUserData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const requiredFields = [
    "hn",
    "title",
    "gender",
    "nationality",
    "religion",
    "education",
    "maritalOptions",
    "birthDate",
    "bloodtype",
    "idCardNumber",
    "firstnameTH",
    "lastnameTH",
    "address",
    "province",
    "amphur",
    "tambon",
    "zipCode",
    "mainTreatmentRights",
    "secondaryTreatmentRights"
  ];

  const isFormIncomplete = requiredFields.some(field => !formData[field]);

  const idCardCheck = async () => {
    console.log(idCardNumber);
    await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/apiEphis/login`, {
      headers: {
        "Authorization": ` ${session.user?.token}`
      }
    }).then(async response => {
      const token2 = response.data.data.token;
      axios
        .get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/GetPattient`, {
          headers: {
            Authorization: `${token2}` // Corrected string interpolation for token2
          },
          params: {
            idcard: idCardNumber,  // user.idCardNumber
          },
        })
        .then(response1 => {
          console.log('Erefer', response1.data.Result[0]);
          const res = response1.data.Result[0]
          console.log(res.PID_PATIENT_DATE_TIME_OF_BIRTH)
          const dateStr = res.PID_PATIENT_DATE_TIME_OF_BIRTH.toString(); // Assuming res.PID_PATIENT_DATE_TIME_OF_BIRTH is 19460310
          const year = dateStr.substring(0, 4);     // Extract the year
          const month = dateStr.substring(4, 6).padStart(2, '0'); // Extract and pad the month
          const day = dateStr.substring(6, 8).padStart(2, '0');   // Extract and pad the day

          const formattedDate = `${year}-${month}-${day}`;
          console.log(formattedDate);
          console.log(new Date(formattedDate)) // Output: "1946-03-10"
          setFormData(prevData => ({
            ...prevData,
            firstnameTH: res?.PID_PATIENT_NAME,
            lastnameTH: res?.PID_PATIENT_LASTNAME,
            idCardNumber: res?.PID_PATIENT_IDENTIFIER_LIST,
            gender: res?.PID_PATIENT_ADMINISTRATIVE_SEX === "M" ? "ชาย" : "หญิง",
            tel: res?.PID_PATIENT_PHONE_NUMBER_BUSINESS,
            birthDate: (new Date(formattedDate)),
          }));
        })
        .catch(error => {
          console.error(error);
        });
    }).catch(error => {
      if (error.response) {
        console.error('Error data:', error.response.data)
        console.error('Error status:', error.response.status)
        console.error('Error headers:', error.response.headers)
      } else {
        console.error('Error:', error.message)
      }
    })
  };


  const uploadImage = async (filePath, file, token) => {
    const avatar = new FormData();
    avatar.append('avatar', file);
    avatar.append('path', filePath);
    avatar.append('s3Path', 'customer')

    const response = await axios.post(`${process.env.NEXT_PUBLIC_TEST_API_URL}/upload`, avatar, {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  };

  const submitForm = async () => {
    setIsLoading(true);
    if (isFormIncomplete) {
      toast.error('กรุณากรอกข้อมูลให้ครบ!');
      setSendData(true);
      setIsLoading(false);
      return;
    }

    try {
      let response;
      let updatedFormData = {
        ...formData,
        province: formData.province.title,
        amphur: formData.amphur.title,
        tambon: formData.tambon.title,
        provinceId: formData.province.id,
        amphurId: formData.amphur.id,
        tambonId: formData.tambon.id,

        // health

      };
      console.log(formData.filePath, formData.file,)

      if (formData.file instanceof File) {
        try {
          const imagePath = await uploadImage(formData.filePath, formData.file, session.user.token);
          console.log(imagePath.data)
          updatedFormData.file = imagePath.data.authUrl;
          updatedFormData.filePath = imagePath.data.fileUrl;
        } catch (error) {
          console.error(error);
          toast.error('Failed to upload image');
          setIsLoading(false);
          return;
        }
      }

      if (isCreate) {
        console.log('Creating');
        console.log(updatedFormData)
        response = await axios.post(`${process.env.NEXT_PUBLIC_TEST_API_URL}/customer`, {
          ...updatedFormData,
          isActive: true,
          hospitalId: session.user.hospitalId,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${session.user.token}`
          },
        });
        onUpdate()
        console.log(response);
        toast.success('บันทึกข้อมูลสำเร็จ!');
        onClose()
        setSendData(false);
      } else {
        console.log('Updating');
        console.log(updatedFormData.file)
        response = await axios.put(`${process.env.NEXT_PUBLIC_TEST_API_URL}/customer/${selectedUserData.id}`, updatedFormData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${session.user.token}`
          },
        });
        onUpdate()
        console.log(response);
        toast.success('บันทึกข้อมูลสำเร็จ!');
        setSendData(false);
        onClose()
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }

    setIsLoading(false);
    setValue('1');
  };

  const onCloseModal = () => {
    onClose(); // Close the modal

    // Use a timeout to ensure the modal closes before resetting the form data
    setTimeout(() => {
      setFormData(initialFormData);
      setSendData(false);
      setValue('1');
    }, 500); // 0 milliseconds timeout to delay execution until after the current call stack is cleared
  };

  return (
    <Dialog open={open} onClose={(event, reason) => {
      if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
        onCloseModal();
      }
    }}

      sx={{
        '& .MuiDialog-paper': {
          height: '1000px', // Fixed height
          display: 'flex',
          flexDirection: 'column',
        },
      }} maxWidth="lg" fullWidth>
      <DialogTitle>
        <div className='flex flex-row justify-between w-full'>
          <div className='w-6/12 flex  items-center'>
            {modalTitle}
          </div>

          {modalTitle === 'เพิ่มข้อมูลลูกค้า' && (
            <Grid container >
              <Grid item xs={12} md={6}>
              
              </Grid>
              <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <CustomTextField
                  className="w-full sm:w-8/12"
                  placeholder='ค้นหาเลขบัตรประชาชน 13 หลัก'
                  name='idCardNumber'
                  onChange={(event) => { setIdCardNumber(event.target.value) }}
                  value={idCardNumber}
                />
                <Button
                  className='ml-2'
                  onClick={idCardCheck}
                  variant="outlined"
                  color="primary"
                >
                  ค้นหา
                </Button>
                
              </Grid>
            </Grid>
          )}
        </div>


      </DialogTitle>
      <DialogContent dividers className='gap-6'>

        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label='simple tabs example'>
            <Tab value='1' label='ข้อมูลส่วนตัว' />
            <Tab value='2' label='ข้อมูลสุขภาพ' />
            <Tab value='3' label='ข้อมูลติดต่อ' />
          </TabList>
          <TabPanel value='1'>
            <AddNewUser formData={formData} setFormData={setFormData} sendData={sendData} />
          </TabPanel>
          <TabPanel value='2'>
            <Health formData={formData} setFormData={setFormData} sendData={sendData} />
          </TabPanel>
          <TabPanel value='3'>
            <ContactInfo formData={formData} setFormData={setFormData} />
          </TabPanel>
        </TabContext>


      </DialogContent>
      <DialogActions >
        <Button disabled={isLoading} onClick={submitForm} variant="outlined" color="primary" className='mt-3'>
          บันทึก
        </Button>
        <Button disabled={isLoading} onClick={onCloseModal} variant="outlined" color="secondary" className='mt-3'>
          ยกเลิก
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserComponent;
