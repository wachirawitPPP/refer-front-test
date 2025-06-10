'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, InputLabel, Typography, Alert } from '@mui/material'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import CustomTextField from '@/@core/components/mui/TextField'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';
//service import
import axios from 'axios'
import { useSession } from 'next-auth/react'
//hook import
import { toast } from 'react-toastify'
import optionsData from '@/data/inputSelectOptions.json';
import { useParams, useRouter } from 'next/navigation'
const initialFormData = {
    hn: '',
    title: 'ไม่ระบุ',
    gender: 'ไม่ระบุ',
    nationality: 'ไม่ระบุ',
    religion: 'ไม่ระบุ',
    education: 'ไม่ระบุ',
    maritalOptions: 'ไม่ระบุ',
    birthDate: null,
    bloodtype: 'ไม่ระบุ',
    idCardNumber: '',
    passportNumber: '',
    firstnameTH: '',
    lastnameTH: '',
    nickname: '',
    firstnameEN: '',
    lastnameEN: '',
    email: '',
    tag: '',
    tel: '',
    address: '',
    province: '',
    amphur: '',
    tambon: '',
    zipCode: '',
    note: '',
    file: '',
    // health
    mainTreatmentRights: '',
    secondaryTreatmentRights: '',
    note2: '',
    drugAllergy: '',
    mentalhealth: '',
    congenitalDisease: '',
    relation: [],
    provinceId: null,
    tambonId: null,
    amphurId: null,
    //age: ''

    // og_hn: "",
}

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

const AddUserComponent = ({ modalTitle, open, onClose, selectedUserData, isCreate, onUpdate }) => {
    const router = useRouter()
    const [value, setValue] = useState('1')
    const [sendData, setSendData] = useState(false)
    const [formData, setFormData] = useState(initialFormData)
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [idCardNumber, setIdCardNumber] = useState('')
    const [ereferData, setEreferData] = useState()
    const [hnPrefix, setHnPrefix] = useState(null);
    const [age, setAge] = useState('')
    const [isValidIdCard, setIsValidIdCard] = useState(true);
    const [idCard, setIdCard] = useState('');
    useEffect(() => {
        if (modalTitle === 'เพิ่มข้อมูลลูกค้า') {
            setFormData(initialFormData);
        } else {
            setFormData({ ...initialFormData, ...selectedUserData });
        }
        setFormData(initialFormData);
    }, [modalTitle, open, selectedUserData])

    const genderOption = optionsData.gender.map((item, index) => ({
        id: `${index + 1}`,
        title: item
    }));
    const bloodOption = optionsData.blood_Refer.map((item, index) => ({
        id: `${index + 1}`,
        title: item
    }));
    const handleDateChange = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            birthDate: date ? date.toISOString() : '',
        }));
    };

    const handleAge = () => {
    };

    const handleChange = (e) => {
        //setValue(newValue)
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    const handleAutocompleteChange = (event, value, name) => {
        setFormData((prevData) => ({ ...prevData, [name]: value ? value.title : '' }));
    };

    const handleIdCardChange = (e) => {
        const regex = /^\d{13}$/;
        const value = e.target.value;
        setIdCard(value);
        setIsValidIdCard(regex.test(value));
        setFormData((prevData) => ({
            ...prevData,
            idCardNumber: regex.test(value) ? value : '',
            //idCardNumber: value || '',
        }));
    };

    const requiredFields = [

        'birthDate',
        'bloodtype',
        'idCardNumber',
        'firstnameTH',
        'lastnameTH',

    ]

    const isFormIncomplete = requiredFields.some(field => !formData[field])
    const formatAge = (value) => {
        if (value) {
            var mdate = value.toString();
            var dobYear = parseInt(mdate.substring(0, 4), 10);
            var dobMonth = parseInt(mdate.substring(5, 7), 10);
            var dobDate = parseInt(mdate.substring(8, 10), 10);

            //get the current date from system
            var today = new Date();
            //date string after broking
            var birthday = new Date(dobYear, dobMonth - 1, dobDate);

            //calculate the difference of dates
            var diffInMillisecond = today.valueOf() - birthday.valueOf();

            //convert the difference in milliseconds and store in day and year variable
            var year_age = Math.floor(diffInMillisecond / 31536000000);
            var day_age = Math.floor((diffInMillisecond % 31536000000) / 86400000);

            //when birth date and month is same as today's date
            if (
                today.getMonth() == birthday.getMonth() &&
                today.getDate() == birthday.getDate()
            ) {
                alert("Happy Birthday!");
            }

            var month_age = Math.floor(day_age / 30);
            var day_ageday_age = day_age % 30;

            var tMnt = month_age + year_age * 12;
            // var tDays = tMnt * 30 + day_age;
            return `${year_age}ปี ${month_age}เดือน ${day_ageday_age}วัน`;
        }
    };

    const idCardCheck = async () => {
        console.log(idCardNumber)
        await axios
            .get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/apiEphis/login`, {
                headers: {
                    Authorization: ` ${session.user?.token}`
                }
            })
            .then(async response => {
                const token2 = response.data.data.token
                axios
                    .get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/GetPattient`, {
                        headers: {
                            Authorization: `${token2}` // Corrected string interpolation for token2
                        },
                        params: {
                            idcard: idCardNumber // user.idCardNumber
                        }
                    })
                    .then(async response1 => {
                        console.log('Erefer', response1.data.Result.length > 0)
                        if (response1.data.Result.length > 0) {
                            toast.success('ค้นหาสำเร็จ', {
                                position: "top-center",
                                autoClose: 1000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            setIdCard(idCardNumber)
                        } else {
                            const SearchByIdcard = await axios
                                .get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/customer-idcard/${idCardNumber}`, {
                                    headers: {
                                        Authorization: `${session.user?.token}` // Corrected string interpolation for token2
                                    },
                                }).then((response) => {

                                    if (!response.data.user) {
                                        toast.warning('ไม่พบข้อมูลในระบบ!', {
                                            position: "top-center",
                                            autoClose: 1000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                        });
                                    } else {
                                        console.log(response)
                                        const res = response.data.user
                                        if(res){
                                            const dateStr = res.birthDate.toString() // Assuming res.PID_PATIENT_DATE_TIME_OF_BIRTH is 19460310
                                        const year = dateStr.substring(0, 4) // Extract the year
                                        const month = dateStr.substring(4, 6).padStart(2, '0') // Extract and pad the month
                                        const day = dateStr.substring(6, 8).padStart(2, '0') // Extract and pad the day

                                        const formattedDate = `${year}-${month}-${day}`
                                        console.log(formattedDate)
                                        setFormData(prevData => ({
                                            ...prevData,
                                            firstnameTH: res?.firstnameTH,
                                            lastnameTH: res?.lastnameTH,
                                            idCardNumber: res?.idCardNumber,
                                            gender: res?.gender === 'ชาย' ? 'ชาย' : res?.gender === 'หญิง' ? 'หญิง' : 'ไม่ระบุ',
                                            tel: res?.tel,
                                            birthDate: res?.birthDate
                                        }))

                                        setAge(formatAge(formattedDate))
                                        toast.success('ค้นหาสำเร็จ', {
                                            position: "top-center",
                                            autoClose: 1000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                        });
                                        }
                                        
                                    }
                                })

                            //console.log("SearchByIdcard", SearchByIdcard)
                        }

                        const res = response1.data.Result[0]
                        console.log(res.PID_PATIENT_DATE_TIME_OF_BIRTH)
                        const dateStr = res.PID_PATIENT_DATE_TIME_OF_BIRTH.toString() // Assuming res.PID_PATIENT_DATE_TIME_OF_BIRTH is 19460310
                        const year = dateStr.substring(0, 4) // Extract the year
                        const month = dateStr.substring(4, 6).padStart(2, '0') // Extract and pad the month
                        const day = dateStr.substring(6, 8).padStart(2, '0') // Extract and pad the day

                        const formattedDate = `${year}-${month}-${day}`
                        console.log(formattedDate)
                        console.log(new Date(formattedDate)) // Output: "1946-03-10"
                        setFormData(prevData => ({
                            ...prevData,
                            firstnameTH: res?.PID_PATIENT_NAME,
                            lastnameTH: res?.PID_PATIENT_LASTNAME,
                            idCardNumber: res?.PID_PATIENT_IDENTIFIER_LIST,
                            gender: res?.PID_PATIENT_ADMINISTRATIVE_SEX === 'M' ? 'ชาย' : 'หญิง',
                            tel: res?.PID_PATIENT_PHONE_NUMBER_BUSINESS,
                            birthDate: new Date(formattedDate)
                        }))

                        setAge(formatAge(formattedDate))
                    })
                    .catch(error => {
                        console.error(error)
                        // toast.warning('ไม่พบข้อมูลในระบบ!', {
                        //     position: "top-center",
                        //     autoClose: 1000,
                        //     hideProgressBar: false,
                        //     closeOnClick: true,
                        //     pauseOnHover: true,
                        //     draggable: true,
                        //     progress: undefined,
                        // });
                    })
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error data:', error.response.data)
                    console.error('Error status:', error.response.status)
                    console.error('Error headers:', error.response.headers)
                } else {
                    console.error('Error:', error.message)
                }
            })
    }

    useEffect(() => {
        if (status === 'authenticated') {
            const fetchData = async () => {
                if (session && session.user.token) {
                    try {
                        const hnCode = await getHn(session.user.token);
                        setFormData((prevData) => ({
                            ...prevData,
                            hn: formData.hn ? formData.hn : hnCode.hnCode,
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

    }, [status, session, setFormData, formData.hn]);

    const uploadImage = async (filePath, file, token) => {
        const avatar = new FormData()
        avatar.append('avatar', file)
        avatar.append('path', filePath)
        avatar.append('s3Path', 'customer')

        const response = await axios.post(`${process.env.NEXT_PUBLIC_TEST_API_URL}/upload`, avatar, {
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    }

    const submitForm = async () => {
        // setIsLoading(true)
        if (isFormIncomplete) {
            toast.error('กรุณากรอกข้อมูลให้ครบ!')
            setSendData(true)
            setIsLoading(false)
            return
        }

        try {

            let DataFormData = {
                ...formData,
                hn: `${hnPrefix}${formData.hn}`,
                birthDate: new Date(formData.birthDate).toISOString()
            };

            console.log(DataFormData)
            const response1 = await axios.post(
                `${process.env.NEXT_PUBLIC_TEST_API_URL}/customer`,
                {
                    ...DataFormData,
                    isActive: true,
                    hospitalId: session.user.hospitalId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${session.user.token}`
                    }
                }
            )

            if (response1.data.message === "already exist customer!") {
                let updatedFormData = {
                    ...formData,
                    hn: response1.data.customer.hn ? response1.data.customer.hn : `${hnPrefix}${formData.hn}`,
                    birthDate: new Date(formData.birthDate).toISOString()
                };
                console.log("create", response1)
                const response2 = await axios
                  .put(
                    `${process.env.NEXT_PUBLIC_TEST_API_URL}/customer/${response1.data.customer.id}`,
                    updatedFormData,
                    {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${session.user.token}`
                      }
                    }
                  )
                  //onUpdate()
                  .then(response => {
                    
                    console.log('update', response)
                    toast.success('อัพเดตข้อมูลสำเร็จ!')
                    setSendData(false)
                    onClose()
                    router.push(
                      `/en/pages/referTable2/${response.data.user.id}?id_card=${response.data.user.idCardNumber}`
                    )
                    
                    //router.push(`/react-table/${response.data.user.idCardNumber}`)
                  })
                

            } else {
                //onUpdate()
                console.log(response1)
                toast.success('บันทึกข้อมูลสำเร็จ!')
                onClose()
                router.push(`/en/pages/referTable2/${response1.data.LastId}?id_card=${response1.data.customer.idCardNumber}`)
                setSendData(false)
                //router.push(`/react-table/${response1.data.customer.idCardNumber}`)
            }

        } catch (error) {
            console.error(error)
            toast.error("Something wrong!")
        }
        // setIsLoading(false)
        // setValue('1')  
    }


    const onCloseModal = () => {
        onClose() // Close the modal
        setAge('')
        setIdCardNumber('')
        // Use a timeout to ensure the modal closes before resetting the form data
        setTimeout(() => {
            setFormData(initialFormData)
            setSendData(false)
            setValue('1')
        }, 500) // 0 milliseconds timeout to delay execution until after the current call stack is cleared
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                        onCloseModal()
                    }
                }}
                sx={{
                    '& .MuiDialog-paper': {
                        height: '600px', // Fixed height
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
                maxWidth='md'
                fullWidth
            >
                <DialogTitle>
                    <div className='flex flex-row justify-between w-full'>
                        <Grid container>
                            <Grid item xs={12} md={4}>
                                <div className='w-12/12 flex items-center'>เพิ่มคนไข้ / ส่งปรึกษา</div>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <div className="flex items-center">
                                    <CustomTextField
                                        className='w-full sm:w-8/12'
                                        placeholder='ค้นหาด้วยเลขบัตรประชาชน 13 หลัก'
                                        name='idCardNumber'
                                        onChange={(event) => { setIdCardNumber(event.target.value) }}
                                        value={idCardNumber}
                                        fullWidth
                                        type="text"
                                        inputProps={{ maxLength: 13 }}
                                        onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '') }}
                                    />
                                    <Button className='ml-2' onClick={idCardCheck} variant='outlined' color='primary'>
                                        ค้นหา
                                    </Button>
                                </div>
                                <span className='text-small' style={{ fontSize: "11px", marginTop: "4px", display: 'block' }}>
                                    *สามารถค้นหาด้วยเลขบัตรประชาชนที่มีอยู่ในเครือ รพ / หรือในระบบ Heart Network*
                                </span>
                            </Grid>
                        </Grid>
                    </div>
                </DialogTitle>
                <DialogContent dividers className='gap-6'>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Typography className='font-medium'>
                                ข้อมูลส่วนตัว
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <CustomTextField
                                fullWidth
                                label='ชื่อ'
                                placeholder="ชื่อ"
                                required
                                onChange={handleChange} name="firstnameTH" value={formData.firstnameTH} error={!formData.firstnameTH && sendData}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} >
                            <CustomTextField
                                fullWidth
                                label='นามสกุล'
                                placeholder="นามสกุล"
                                required
                                onChange={handleChange} name="lastnameTH" value={formData.lastnameTH || ''} error={!formData.lastnameTH && sendData}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <CustomAutocomplete
                                fullWidth
                                options={genderOption}
                                getOptionLabel={option => option.title || ''}
                                onChange={(event, value) => handleAutocompleteChange(event, value, 'gender')}
                                value={genderOption.find(option => option.title === formData.gender) || null}
                                id='genderOption'
                                renderInput={params => (
                                    <CustomTextField
                                        placeholder='เพศ'
                                        {...params}
                                        label='เพศ'
                                        required
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <CustomAutocomplete
                                fullWidth
                                options={bloodOption}
                                getOptionLabel={option => option.title || ''}
                                value={bloodOption.find(option => option.title === formData.bloodtype) || null}
                                onChange={(event, value) => handleAutocompleteChange(event, value, 'bloodtype')}
                                renderInput={params => (
                                    <CustomTextField
                                        placeholder='กรุ๊ปเลือด'
                                        {...params}
                                        label='กรุ๊ปเลือด'
                                        required
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <AppReactDatepicker
                                readonly
                                selected={formData.birthDate}
                                id='birthDate-input'
                                onChange={handleDateChange}
                                showYearDropdown
                                showMonthDropdown
                                placeholderText='วันเกิด'
                                required
                                locale="th"
                                customInput={<CustomTextField label='วันเกิด' error={!formData.birthDate && sendData} />}
                            />

                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <CustomTextField
                                disabled
                                fullWidth
                                label='อายุ'
                                placeholder="xx"
                                value={age || ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <CustomTextField
                                fullWidth
                                label='เลขบัตรประชาชน'
                                placeholder="เลขบัตรประชาชน"
                                required
                                type="text"
                                value={isValidIdCard ? formData.idCardNumber : idCard} onChange={handleIdCardChange} error={!formData.idCardNumber && sendData}
                                inputProps={
                                    { maxLength: 13 }
                                }
                                onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, '') }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} >
                            <CustomTextField
                                disabled
                                fullWidth
                                label='HeartNetwork NO.'
                                placeholder="รหัสคนไข้"
                                onChange={handleChange} value={hnPrefix + formData.hn || ''} error={!formData.hn && sendData}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} >
                            <CustomTextField
                                disabled
                                fullWidth
                                label='Hospital NO.'
                                placeholder="HN"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} >
                            <CustomTextField
                                disabled
                                fullWidth
                                label='รหัสหน่วยงาน'
                                placeholder="HPT"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isLoading} onClick={submitForm} variant='outlined' color='primary' className='mt-3'>
                        บันทึก
                    </Button>
                    <Button disabled={isLoading} onClick={onCloseModal} variant='outlined' color='secondary' className='mt-3'>
                        ยกเลิก
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddUserComponent
