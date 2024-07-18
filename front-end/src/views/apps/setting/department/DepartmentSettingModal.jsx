import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';
import { toast, Flip } from 'react-toastify';
import CustomTextField from '@core/components/mui/TextField';

import { useSession } from 'next-auth/react';

const DepartmentSettingModal = ({ title, user, onChange, onSave, open, onClose, isEdit, isCreate }) => {
  const [errors, setErrors] = useState({
    name: false,
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    departmentCode: '',
    secretKey: ''
  });
  const { data: session, status } = useSession();

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: user.name,
        departmentCode: user.departmentCode,
        secretKey: user.secretKey
      });
    } else if (isCreate) {
      setFormData({
        name: user.name,
        departmentCode: user.departmentCode,
        secretKey: user.secretKey,
        
      });
    }
  }, [isEdit, isCreate, user]);

  useEffect(() => {
    if (open) {
      setErrors({
        name: false,
      });
    }
  }, [open]);

  const validateForm = () => {
    const tempErrors = {
      name: !formData.name,
    };
    setErrors(tempErrors);
    setLoading(false);
    return !Object.values(tempErrors).includes(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      let response;
      

      if (isEdit) {
       
        
        response = await axios.put(`${process.env.NEXT_PUBLIC_TEST_API_URL}/department/${user.id}`,{ 
          name:formData.name,
          departmentCode:formData.departmentCode,
          secretKey:formData.secretKey  }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${session.user.token}`
          },
        });

       
      } else {
        console.log({ name: formData.name,
          secretKey: formData.secretKey,
          departmentCode: formData.departmentCode,
          hospitalId: session.user.hospitalId,});
        response = await axios.post(`${process.env.NEXT_PUBLIC_TEST_API_URL}/department`, { 
          name: formData.name,
          secretKey: formData.secretKey,
          departmentCode: formData.departmentCode,
          hospitalId: session.user.hospitalId,
        } , {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${session.user.token}`
          },
        });
       
      }
      toast.success('บันทึกข้อมูลสำเร็จ', {
        position: 'top-right',
        autoClose: 5000,
        transition: Flip,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
      })

      setLoading(false);
      
     
      onSave();
      onClose();
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด', {
        position: 'top-right',
        autoClose: 5000,
        transition: Flip,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
      });
      setLoading(false);
      console.error('There was an error uploading the data!', error);
    }
  };

  const handleCloseButtonClick = () => {
    onClose();
  };
  

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers className='gap-4'>
          <Grid container spacing={12}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='รหัสแผนก / หน่วยงาน'
                placeholder='รหัสแผนก / หน่วยงาน'
                error={errors.departmentCode}
                value={formData.departmentCode}
                onChange={e => setFormData({ ...formData, departmentCode: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='ชื่อแผนก / หน่วยงาน'
                placeholder='ชื่อแผนก / หน่วยงาน'
                error={errors.name}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <CustomTextField
                fullWidth
                label='LINE Noti Secret key'
                placeholder='LINE Noti Secret key'
                error={errors.secretKey}
                value={formData.secretKey}
                onChange={e => setFormData({ ...formData, secretKey: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="gap-2 mt-4">
          <LoadingButton loading={loading} type="submit" variant="outlined" color="primary" disabled={loading}>
            บันทึก
          </LoadingButton>
          <Button onClick={handleCloseButtonClick} variant="outlined" color="secondary" disabled={loading}>
            ยกเลิก
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DepartmentSettingModal;
