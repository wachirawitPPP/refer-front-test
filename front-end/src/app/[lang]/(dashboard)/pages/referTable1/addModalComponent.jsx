'use client'

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
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

const initialFormData = {
  hn:"",
  title: "",
  gender: "",
  nationality: "",
  religion: "",
  education: "",
  maritalOptions: "",
  birthDate: null,
  bloodtype: "",
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
  file: [],
  // health
  mainTreatmentRights: "",
  secondaryTreatmentRights: "",
  note2: "",
  drugAllergy: "",
  mentalhealth: "",
  congenitalDisease: "",
  relation: []
};

const AddUserComponent = ({ modalTitle, open, onClose, selectedUserData, isCreate, onUpdate }) => {
  const [value, setValue] = useState('1');
  const [sendData, setSendData] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const { data: session, status } = useSession();

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

  const submitForm = async () => {
    if (isFormIncomplete) {
      toast.error('กรุณากรอกข้อมูลให้ครบ!');
      setSendData(true);
    } else {
      try {
        let response;
        if (isCreate) {
          console.log('Creating');
          response = await axios.post(`${process.env.NEXT_PUBLIC_TEST_API_URL}/customer`, {
            ...formData,
            
            isActive: true,
            hospitalId: session.user.hospitalId,
            file: 'ssss'
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${session.user.token}`
            },
          });
        } else {
          console.log('Updating');
          response = await axios.put(`${process.env.NEXT_PUBLIC_TEST_API_URL}/customer/${selectedUserData.id}`, {
            formData
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${session.user.token}`
            },
          });
        }
        console.log(response);
        onUpdate(); // Trigger the update
        onClose();
        toast.success('บันทึกข้อมูลสำเร็จ!');
        setSendData(false);
        console.log(formData);
      } catch (error) {
        console.error(error);
        toast.error('การบันทึกข้อมูลล้มเหลว');
      }
    }
    setValue('1');
  };

  const onCloseModal = () => {
    setFormData(initialFormData);
    setSendData(false);
    onClose();
    setValue('1');
  };

  return (
    <Dialog open={open} onClose={(event, reason) => {
      if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
        onCloseModal();
      }
    }} maxWidth="lg" fullWidth>
      <DialogTitle>
        {modalTitle}
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
        <Button onClick={submitForm} variant="outlined" color="primary" className='mt-3'>
          บันทึก
        </Button>
        <Button onClick={onCloseModal} variant="outlined" color="secondary" className='mt-3'>
          ยกเลิก
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserComponent;
