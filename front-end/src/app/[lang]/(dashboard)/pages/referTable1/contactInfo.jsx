import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import { Button, Grid, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
// import relation from '../../../../../data/relation.json'
import relation from '@/data/relation.json'

export default function ContactInfo({formData, setFormData}) {

    const [formValues, setFormValues] = useState([]);
    const [currentValues, setCurrentValues] = useState({
        name: '',
        tel:'',
        relation: null,
    });

    const [showRow, setShowRow] = useState(formData.relation)
    useEffect(() => {
        if (formData.relation) {
            setFormValues(formData.relation)
        }
    }, []);

    const mapData = relation.family_relation.map((item, index) => ({
        id: `${index + 1}`,
        title: item
    }));

    const handleChange = (event, newValue) => {
        
        if (event && event.target) {
            const { name, value } = event.target;
            setCurrentValues((prevValues) => ({
                ...prevValues,
                [name]: value,
            }));
            // console.log({ ...currentValues, [name]: value }, "currentValues");
            
        } else {
            setCurrentValues((prevValues) => ({
                ...prevValues,
                relation: newValue,
            }));
            // console.log({ ...currentValues, relation: newValue }, "currentValues");
        }
        // console.log(event.target,"event")

    };

    const addFormFields = () => {

        setFormValues([...formValues, currentValues]);
        setCurrentValues({ name: "", tel:"",relation: null });
        setShowRow(true)

        setFormData((prevValues) => ({
            ...prevValues, relation: [...formValues, currentValues] }
       ))
        // console.log(formValues, "formValues")
        // console.log(currentValues, "currentValues")
       
    }
//  console.log(formData, "formData")
    const removeFormFields = (i) => {
        const newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)

        setFormData((prevValues) => ({
            ...prevValues, relation: newFormValues }
       ))
    }

    return (
        <>
            <Grid item xs={12} sm={6} className='p-3 space-y-2'>

                <Grid container spacing={4}>

                    <Grid item xs={4} md={3}>
                        <label htmlFor="name-field1" className='label' style={{fontSize:"13px"}}>ชื่อ-นามสกุล</label>
                    </Grid>
                    <Grid item xs={4} md={3}>
                        <label htmlFor="name-field2" className='label' style={{fontSize:"13px"}}>เบอร์โทร</label>
                    </Grid>
                    <Grid item xs={4} md={3}>
                        <label htmlFor="autocomplete-custom3" className='label' style={{fontSize:"13px"}}>ความสัมพันธ์</label>
                    </Grid>
                    <Grid item xs={0} md={3}>
                    </Grid>
                </Grid>
                <Grid container className='space-y-1'>

                    {showRow && formValues.map((element, index) => (
                        <Grid container spacing={4} key={index}>
                            <Grid item xs={3} md={3}>
                                <CustomTextField id="name-field1" disabled value={element.name} fullWidth placeholder='ชื่อ-นามสกุล' />
                            </Grid>
                            <Grid item xs={3} md={3}>
                                <CustomTextField id="name-field2" disabled value={element.tel} fullWidth placeholder='เบอร์โทร' />
                            </Grid>
                            <Grid item xs={3} md={3}>
                                <CustomAutocomplete
                                    disabled
                                    fullWidth
                                    value={element.relation}
                                    options={mapData}
                                    id='autocomplete-custom3'
                                    getOptionLabel={option => option.title || ''}
                                    isOptionEqualToValue={(option,  value) => option.id === value?.id}
                                    renderInput={params => <CustomTextField placeholder='ความสัมพันธ์' {...params} />}
                                />
                            </Grid>

                            <Grid item xs={3} md={3}>
                                <Button fullWidth variant='contained' color='error' onClick={removeFormFields}><i className='tabler-trash text-[22px]'/></Button>
                            </Grid>
                        </Grid>
                    ))}
                    <Grid container spacing={4}>
                        <Grid item xs={3} md={3}>
                            <CustomTextField name="name" value={currentValues.name} onChange={handleChange} fullWidth placeholder='ชื่อ-นามสกุล' />
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <CustomTextField name="tel" value={currentValues.tel} onChange={handleChange} fullWidth placeholder='เบอร์โทร' />
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <CustomAutocomplete
                                fullWidth
                                value={currentValues.relation}
                                name="relation"
                                // onChange={handleChange}
                                onChange={(event, newValue) => handleChange(null, newValue)}
                                // onChange={e => handleChange(e.target.value, "relation")}
                                options={mapData}
                                id='autocomplete-custom'
                                getOptionLabel={option => option.title || ''}
                                isOptionEqualToValue={(option,  value) => option.id === value?.id}
                                // isOptionEqualToValue={(option, value) => option.title === value?.title}
                                renderInput={params => <CustomTextField placeholder='ความสัมพันธ์' {...params} />}
                            />
                        </Grid>
                        {currentValues.name && currentValues.relation ? (<Grid item xs={12} md={3}>
                            <Button fullWidth onClick={addFormFields} variant='contained'><i className='tabler-plus text-[22px]' /></Button>
                        </Grid>) : (<Grid item xs={3} md={3}>
                            <Button fullWidth variant='contained' disabled><i className='tabler-plus text-[22px]' /></Button>
                        </Grid>)}
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
