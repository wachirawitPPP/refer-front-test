import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  MenuItem,
} from '@mui/material';
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';
import CustomTextField from '@core/components/mui/TextField';
import CustomAutocomplete from '@core/components/mui/Autocomplete';
import axios from 'axios';
import { toast,Flip } from 'react-toastify'

const EditDialog = ({ open, onClose, selectedUser, onUpdate, isCreate, isEdit, isConfirm }) => {
  
  const [formData, setFormData] = useState({ 
  });
  

  useEffect(() => {
    if (selectedUser && isEdit) {
      setFormData({
        referDate: new Date(selectedUser.attributes.referDate),
        destinationHospital: selectedUser.attributes.destinationHospital,
        department: selectedUser.attributes.department,
        createBy: selectedUser.attributes.originHospital,
        urgent: selectedUser.attributes.urgent,
        status: selectedUser.attributes.status,
        createDate: new Date(selectedUser.attributes.createdAt)
      });
    }
    if (selectedUser && isConfirm) {
      setFormData({
        referDate:new Date(selectedUser.attributes.referDate),
        destinationHospital: selectedUser.attributes.destinationHospital,
        department: selectedUser.attributes.department,
        createBy: selectedUser.attributes.originHospital,
        urgent: selectedUser.attributes.urgent,
        status: selectedUser.attributes.status,
        confirmDate: new Date(),
        
      });
    }
    if (selectedUser && isCreate){
      console.log(selectedUser.firstnameTH);
      setFormData({
    name: selectedUser.firstnameTH  + ' ' + selectedUser.lastnameTH,
    referDate: new Date(),
    destinationHospital: '',
    department: '',
    createBy: '',
    urgent: '',
    status: 'รอการยืนยัน',
    originHospital: 'โรงพยาบาล A ',
    hn: selectedUser.hn
      })
    }
    
  }, [selectedUser, isCreate]);

  const handleSubmit = async () => {
    const data = isCreate ? {
      data: {
        name: formData.name,
        referDate: formData.referDate,
        destinationHospital: formData.destinationHospital,
        department: formData.department,
        createBy: formData.createBy,
        urgent: formData.urgent,
        status: formData.status,
        originHospital: formData.originHospital,
        hn :formData.hn,
      }
    }:{
      data: {
        referDate: formData.referDate,
        destinationHospital: formData.destinationHospital,
        department: formData.department,
        createBy: formData.createBy,
        urgent: formData.urgent,
        status: isConfirm ? 'รับเข้ารักษา' : formData.status,
        confirmDate: formData.confirmDate,
      }
    }
    ;
   

    try {
      console.log(data);
      const response = isCreate
        ? await axios.post(`http://localhost:1337/api/refer-lists`, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        : await axios.put(`http://localhost:1337/api/refer-lists/${selectedUser.id}`, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          toast.success('บันทึกข้อมูลสำเร็จ',
            {
              position: 'top-right',
              autoClose: 5000,
              transition: Flip,
              closeOnClick: true,
              pauseOnHover: true,
             
             
            });
      if (response.status === isCreate ? 201 : 200) {
        
        onClose();
        if (onUpdate) {
          onUpdate();
        }
      } else {
        console.error(`Failed to ${isCreate ? 'create' : 'update'} data:`, response.status);
      }
    } catch (error) {
      toast.error(`เกิดข้อผิดพลาด`,
        {
          position: 'top-right',
          autoClose: 5000,
          transition: Flip,
          closeOnClick: true,
          pauseOnHover: true,
          hideProgressBar: false,
         
         
        });
      console.error(`Error ${isCreate ? 'creating' : 'updating'} data:`, error);
    }
  };

  return (
    <Dialog open={open} onClose={(event, reason) => {
      if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
        onClose();
      }
    }} fullWidth maxWidth='sm'>
      <DialogTitle>{isCreate ? 'ส่งตัว' : 'แก้ไข'}</DialogTitle>
      <DialogContent dividers>
        <form action=''>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <AppReactDatepicker
                id='refer-date'
                dateFormat='dd/MM/yyyy'
                placeholderText='วันที่อ้างอิง'
                selected={new Date(formData.referDate)}
                onChange={(date) => setFormData({ ...formData, referDate: date })}
                customInput={<CustomTextField label='วันที่อ้างอิง' fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomAutocomplete
                fullWidth
                options={['Hospital A', 'Hospital B', 'Hospital C']}
                value={formData.destinationHospital}
                onChange={(event, newValue) => setFormData({ ...formData, destinationHospital: newValue })}
                renderInput={(params) => <CustomTextField {...params} label='โรงพยาบาลปลายทาง' />}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomAutocomplete
                fullWidth
                options={['Department A', 'Department B', 'Department C']}
                value={formData.department}
                onChange={(event, newValue) => setFormData({ ...formData, department: newValue })}
                renderInput={(params) => <CustomTextField {...params} label='แผนก' />}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomAutocomplete
                fullWidth
                options={['User A', 'User B', 'User C']}
                value={formData.createBy}
                onChange={(event, newValue) => setFormData({ ...formData, createBy: newValue })}
                renderInput={(params) => <CustomTextField {...params} label='แพทย์ส่งตัว' />}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label='ความเร่งด่วน'
                
                value={formData.urgent}
                onChange={(e) => setFormData({ ...formData, urgent: e.target.value })}
              >
                <MenuItem className='text-error' value='Emergency'>Emergency</MenuItem>
                <MenuItem className='text-warning'value='Urgency'>Urgency</MenuItem>
                <MenuItem className='text-secondary' value='Elective'>Elective</MenuItem>
                
              </CustomTextField>
            </Grid>
            {isConfirm && <Grid item xs={12}>
              <AppReactDatepicker
          
                id='refer-date'
                dateFormat='dd/MM/yyyy'
                placeholderText='วันที่ตอบรับ'
                maxDate={new Date()}
                selected={new Date(formData.confirmDate)}
                onChange={(date) => setFormData({ ...formData, confirmDate: date })}
                customInput={<CustomTextField label='วันที่ตอบรับ' fullWidth />}
              />
            </Grid>}
            
          </Grid>
        </form>
      </DialogContent>
      <DialogActions className='p-4'>
        <Button onClick={handleSubmit} variant='outlined' color='primary'>
          {isCreate ? 'สร้าง' : 'บันทึก'}
        </Button>
        <Button onClick={onClose} variant='outlined' color='secondary'>
          ยกเลิก
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
