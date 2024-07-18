'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import MuiStep from '@mui/material/Step'

// import CloseIcon from '@mui/icons-material/Close'

// Third-party Imports
import { toast, Flip } from 'react-toastify'
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import DirectionalIcon from '@components/DirectionalIcon'
import CustomTextField from '@core/components/mui/TextField'
import DisplayImageOPD from './detail/displayImageOPD'
import ReferForm from './detail/refer-form'

import ForSelectOPD from './detail/forSelectOPD'

// Styles Component Imports
import StepperWrapper from '@core/styles/stepper'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

// Vars
const steps = [
  {
    icon: 'tabler-file-analytics',
    title: 'รายละเอียดการส่งตัว',
    subtitle: 'โปรดระบุรายละเอียด'
  },
  {
    icon: 'tabler-user',
    title: 'Personal Info',
    subtitle: 'Setup Information'
  },
  {
    icon: 'tabler-brand-instagram',
    title: 'Social Links',
    subtitle: 'Add Social Links'
  }
]

const dataOPD = [
  {
    id: "OPD0001",
    name: "ประสาน ศรีโสภา",
    department: "0001 : แม่และเด็ก",
    createBy: "นายแพทย์ A",
    type: "OPD",
    createAt: "27/06/2024 16.00",
    status: "active",
    apiTest: "https://api.sampleapis.com/coffee/hot"
  },
  {
    id: "OPD0002",
    name: "ประสาน ศรีโสภา",
    department: "0001 : แม่และเด็ก",
    createBy: "นายแพทย์ A",
    type: "OPD",
    createAt: "27/06/2024 16.00",
    status: "active",
    apiTest: "https://api.sampleapis.com/coffee/hot"
  },
  {
    id: "OPD0003",
    name: "ประสาน ศรีโสภา",
    department: "0001 : แม่และเด็ก",
    createBy: "นายแพทย์ A",
    type: "OPD",
    createAt: "27/06/2024 16.00",
    status: "inactive",
    apiTest: "https://api.sampleapis.com/coffee/hot"
  },
  {
    id: "OPD0004",
    name: "ประสาน ศรีโสภา",
    department: "0001 : แม่และเด็ก",
    createBy: "นายแพทย์ A",
    type: "OPD",
    createAt: "27/06/2024 16.00",
    status: "active",
    apiTest: "https://api.sampleapis.com/coffee/hot"
  },
  {
    id: "OPD0005",
    name: "ประสาน ศรีโสภา",
    department: "0001 : แม่และเด็ก",
    createBy: "นายแพทย์ A",
    type: "OPD",
    createAt: "27/06/2024 16.00",
    status: "active",
    apiTest: "https://api.sampleapis.com/coffee/hot"
  },
  {
    id: "OPD0006",
    name: "ประสาน ศรีโสภา",
    department: "0001 : แม่และเด็ก",
    createBy: "นายแพทย์ A",
    type: "OPD",
    createAt: "27/06/2024 16.00",
    status: "active",
    apiTest: "https://api.sampleapis.com/coffee/hot"
  },
  {
    id: "OPD0007",
    name: "ประสาน ศรีโสภา",
    department: "0001 : แม่และเด็ก",
    createBy: "นายแพทย์ A",
    type: "OPD",
    createAt: "27/06/2024 16.00",
    status: "inactive",
    apiTest: "https://api.sampleapis.com/coffee/hot"
  },
  {
    id: "OPD0008",
    name: "ประสาน ศรีโสภา",
    department: "0001 : แม่และเด็ก",
    createBy: "นายแพทย์ A",
    type: "OPD",
    createAt: "27/06/2024 16.00",
    status: "active",
    apiTest: "https://api.sampleapis.com/coffee/hot"
  },
  {
    id: "OPD0009",
    name: "ประสาน ศรีโสภา",
    department: "0001 : แม่และเด็ก",
    createBy: "นายแพทย์ A",
    type: "OPD",
    createAt: "27/06/2024 16.00",
    status: "inactive",
    apiTest: "https://api.sampleapis.com/coffee/hot"
  },
  {
    id: "OPD0010",
    name: "ประสาน ศรีโสภา",
    department: "0001 : แม่และเด็ก",
    createBy: "นายแพทย์ A",
    type: "OPD",
    createAt: "27/06/2024 16.00",
    status: "active",
    apiTest: "https://api.sampleapis.com/coffee/hot"
  }
];

const Step = styled(MuiStep)(({ theme }) => ({
  paddingInline: theme.spacing(7),
  '&:first-of-type': {
    paddingLeft: 0
  },
  '&:last-of-type': {
    paddingRight: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '&.Mui-completed .step-title, &.Mui-completed .step-subtitle': {
    color: 'var(--mui-palette-text-disabled)'
  },
  [theme.breakpoints.down('md')]: {
    padding: 0,
    ':not(:last-of-type)': {
      marginBlockEnd: theme.spacing(6)
    }
  }
}))

const StepperCustomHorizontal = ({ open, onClose, selectedUser, isCreate, isEdit, isConfirm }) => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({});
  const [linkFiles, setLinkFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectOPD, setSelectOPD] = useState([])
  
  const [confirmModal, setConfirmModal] = useState(false)

  const [checkedItems, setCheckedItems] = useState({});
  const [checkedItemsImage, setCheckedItemsImage] = useState({});
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [isAllCheckedImage, setIsAllCheckedImage] = useState(false);
  const [isIndeterminateImage, setIsIndeterminateImage] = useState(false);

  const fetchPreviews = async () => {
    try {
      setLoading(true);
      const responses = await Promise.all(

        dataOPD.map(async (apiInfo) => {
          const response = await fetch(apiInfo.apiTest);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const json = await response.json();
          return {
            id: apiInfo.id,
            department: apiInfo.department,
            createBy: apiInfo.createBy,
            type: apiInfo.type,
            createAt: apiInfo.createAt, data: json
          }; // Include id in the response
        })
      );
      setLinkFiles(responses);

      setCheckedItems(
        responses.reduce((acc, item) => {
          acc[item.id] = false;
          return acc;
        }, {})
      );

      setCheckedItemsImage(
        responses.reduce((acc, item) => {
          item.data.forEach((dataItem) => {
            acc[String(dataItem.id)] = false;
          });
          return acc;
        }, {})
      );

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false)
    }

  };

  const handleChangeSelect = (event) => {
    const { name, checked } = event.target;
    if (name === 'all') {

      // let newGroup = {};
      // Object.keys(group).forEach(key => {
      //     newGroup[key] = checked;
      // });
      // return newGroup;

      const newCheckedItems = Object.keys(checkedItems).reduce((acc, key) => {
        acc[key] = checked;
        return acc;
      }, {});

      console.log(newCheckedItems, "newCheckedItems")

      setCheckedItems(newCheckedItems);
      setIsAllChecked(checked);
      setIsIndeterminate(false);
    } else {
      const newCheckedItems = {
        ...checkedItems,
        [name]: checked,
      };
      const allChecked = Object.values(newCheckedItems).every(Boolean);
      const noneChecked = Object.values(newCheckedItems).every((val) => !val);
      setIsAllChecked(allChecked);
      setIsIndeterminate(!allChecked && !noneChecked);
      setCheckedItems(newCheckedItems);
    }
  };

  const handleChangeSelectImage = (event) => {
    const { name, checked } = event.target;

    const newCheckedItemsImage = Object.keys(checkedItemsImage).reduce((acc, key) => {
      acc[key] = checked;
      return acc;
    }, {});

    setCheckedItemsImage(newCheckedItemsImage);
    setIsAllCheckedImage(checked);
    setIsIndeterminateImage(false);

    if (name === 'allCheck') {
      const newCheckedItemsImage = Object.keys(checkedItemsImage).reduce((acc, key) => {
        acc[key] = checked;
        return acc;
      }, {});
      setCheckedItemsImage(newCheckedItemsImage);
      setIsAllCheckedImage(checked);
      setIsIndeterminateImage(false);
    } else {
      const newCheckedItemsImage = {
        ...checkedItemsImage,
        [name]: checked,
      };
      const allCheckedImage = Object.values(newCheckedItemsImage).every(Boolean);
      const noneCheckedImage = Object.values(newCheckedItemsImage).every((val) => !val);
      setIsAllCheckedImage(allCheckedImage);
      setIsIndeterminateImage(!allCheckedImage && !noneCheckedImage);
      setCheckedItemsImage(newCheckedItemsImage);
    }
  };


  useEffect(() => {

    if (open) {
      fetchPreviews();
      setCheckedItems([])
      setIsAllChecked(false)
      setIsAllCheckedImage(false)
      setCheckedItemsImage([])
      setActiveStep(0);
      setSelectOPD([])
      if (isCreate) {
        setFormData({
          name: selectedUser.firstnameTH + ' ' + selectedUser.lastnameTH,
          referDate: new Date(),
          destinationHospital: '',
          department: '',
          createBy: '',
          urgent: '',
          status: 'รอการยืนยัน',
          originHospital: 'โรงพยาบาล A ',
          hn: selectedUser.hn,
          createDate: new Date(),
          confirmDate: new Date(),
        });
      } else if (selectedUser && isEdit || isConfirm) {
        setFormData({
          referDate: new Date(selectedUser.attributes.referDate),
          destinationHospital: selectedUser.attributes.destinationHospital,
          department: selectedUser.attributes.department,
          createBy: selectedUser.attributes.createBy,
          originHospital: selectedUser.attributes.originHospital,
          urgent: selectedUser.attributes.urgent,
          status: selectedUser.attributes.status,
          name: selectedUser.attributes.name,
          hn: selectedUser.attributes.hn,
          createDate: new Date(selectedUser.attributes.createdAt),
          confirmDate: new Date(),
        });
      }
    }
  }, [open, isCreate, selectedUser, isEdit]);

  const handleSubmit = () => {
    const finalData = {
      data: {
        name: formData.name,
        referDate: new Date(formData.referDate).toISOString(),
        destinationHospital: formData.destinationHospital,
        department: formData.department,
        createBy: formData.createBy,
        urgent: formData.urgent,
        status: formData.status,
        originHospital: formData.originHospital,
        hn: formData.hn,
      }
    };

    // Add your submission logic here (e.g., send the JSON data to a server)
    console.log('Form Submitted:', finalData);

    toast.success('บันทึกข้อมูลสำเร็จ', {
      position: 'top-right',
      autoClose: 5000,
      transition: Flip,
      closeOnClick: true,
      pauseOnHover: true,
      hideProgressBar: false,
    })

    onClose()
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      setConfirmModal(true)
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const renderStepContent = activeStep => {
    switch (activeStep) {
      case 0:
        return <ReferForm selectedUser={selectedUser} formData={formData} setFormData={setFormData} isConfirm={isConfirm} />;
      case 1:
        return <ForSelectOPD selectOPD={selectOPD} setSelectOPD={setSelectOPD} />;
      case 2:
        return <DisplayImageOPD linkFiles={linkFiles} setLinkFiles loading={loading} fetchPreviews={fetchPreviews} checkedItems={checkedItems} checkedItemsImage={checkedItemsImage} isAllChecked={isAllChecked} isIndeterminate={isIndeterminate} isIndeterminateImage={isIndeterminateImage} isAllCheckedImage={isAllCheckedImage} handleChangeSelect={handleChangeSelect} handleChangeSelectImage={handleChangeSelectImage} />;
      // checkedItems={checkedItems} setCheckedItems={setCheckedItems} checkedItemsImage={checkedItemsImage} setCheckedItemsImage={setCheckedItemsImage} isAllChecked={isAllChecked} isIndeterminate={isIndeterminate} isIndeterminateImage={isIndeterminateImage} isAllCheckedImage={isAllCheckedImage} handleChangeSelect={handleChangeSelect} handleChangeSelectImage={handleChangeSelectImage}
      default:
        return 'Unknown step';
    }
  };

  return (
    <>
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
      sx={{
        '& .MuiDialog-paper': {
          height: '1000px', // Fixed height
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      fullWidth
      maxWidth='lg'
    >
      <DialogTitle>
        <Typography className='font-medium' color='text.primary'>
          {steps[activeStep].title}
        </Typography>
        <Typography variant='body2'>{steps[activeStep].subtitle}</Typography>

      </DialogTitle>
      <Divider className='mlb-1' />
      <DialogContent className='justify-center' >


        <form onSubmit={e => e.preventDefault()}>
          <Grid container>
            <Grid item xs={12} className='mt-2'>
              {renderStepContent(activeStep)}
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <Divider className='mlb-1' />

      <DialogActions className="w-full ">
        <div className="flex justify-between w-full mt-1">
          <div>
            <Button variant="outlined" onClick={onClose} color='secondary'>
              ยกเลิก
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
              color='secondary'
            >
              กลับ
            </Button>
            {(isCreate || isEdit) && (<Button
              variant="outlined"
              onClick={handleNext}
              endIcon={
                activeStep === steps.length - 1 ? (
                  <i className='tabler-check' />
                ) : (
                  <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
                )
              }
            >
              {activeStep === steps.length - 1 ? 'บันทึก' : 'ต่อไป'}
            </Button>)}

            {isConfirm && <Button
              variant="outlined"
              onClick={handleNext}
              endIcon={
                activeStep === steps.length - 1 ? (
                  <i className='tabler-check' />
                ) : (
                  <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
                )
              }
            >
              {activeStep === steps.length - 1 ? 'รับปรึกษา' : 'ต่อไป'}
            </Button>}
          </div>
        </div>
      </DialogActions>

    </Dialog>
    {/* {confirmModal && (
      <Dialog
      open={true}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      > 
        <DialogTitle>
          asdasd
        </DialogTitle>
        <DialogContent>
          <Typography>
            ต้องการยืนยันการบันทึกใช่หรือไม่?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant='outlined'   color="secondary">
            ยกเลิก
          </Button>
          <Button variant='outlined'  onClick={() => handleSubmit()} color="primary">
            ยืนยัน
          </Button>
        </DialogActions>
        
      </Dialog>
    )} */}
    </>
    
    
   
  )
  ;
};

export default StepperCustomHorizontal;
