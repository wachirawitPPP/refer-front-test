import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import { Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
// import relation from '../../../../../data/relation.json'
import relation from '@/data/relation.json'

export default function ContactInfo({ formData, setFormData }) {

    const [formValues, setFormValues] = useState([]);
    const [currentValues, setCurrentValues] = useState({
        name: '',
        tel: '',
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
        } else {
            setCurrentValues((prevValues) => ({
                ...prevValues,
                relation: newValue,
            }));
        }
    };

    const addFormFields = () => {
        setFormValues([...formValues, currentValues]);
        setCurrentValues({ name: "", tel: "", relation: null });
        setShowRow(true)

        setFormData((prevValues) => ({
            ...prevValues, relation: [...formValues, currentValues]
        }))
    }

    const removeFormFields = (i) => {
        const newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)

        setFormData((prevValues) => ({
            ...prevValues, relation: newFormValues
        }))
    }

    return (
        <>
            <Grid container className='p-3 space-y-2'>

               
                <Grid container className='space-y-1' spacing={2}>

                    {showRow && formValues.map((element, index) => (
                        <Grid container spacing={2} key={index}>
                            <Grid item xs={12} sm={4}>
                                <CustomTextField  id="name-field1" disabled value={element.name} fullWidth placeholder='ชื่อ-นามสกุล' />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <CustomTextField  id="name-field2" disabled value={element.tel} fullWidth placeholder='เบอร์โทร' />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <CustomAutocomplete
                                
                                    disabled
                                    fullWidth
                                    value={element.relation}
                                    options={mapData}
                                    id='autocomplete-custom3'
                                    getOptionLabel={option => option.title || ''}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    renderInput={params => <CustomTextField  placeholder='ความสัมพันธ์' {...params} />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={1}>
                                <Button  fullWidth variant="tonal" color='error' onClick={() => removeFormFields(index)}><i className='tabler-trash text-[22px]' /></Button>
                            </Grid>
                        </Grid>
                    ))}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <CustomTextField  name="name" value={currentValues.name} onChange={handleChange} fullWidth placeholder='ชื่อ-นามสกุล' />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <CustomTextField name="tel" value={currentValues.tel} onChange={handleChange} fullWidth placeholder='เบอร์โทร' />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <CustomAutocomplete
                                fullWidth
                                value={currentValues.relation}
                                name="relation"
                                onChange={(event, newValue) => handleChange(null, newValue)}
                                options={mapData}
                                id='autocomplete-custom'
                                getOptionLabel={option => option.title || ''}
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                renderInput={params => <CustomTextField placeholder='ความสัมพันธ์' {...params} />}
                            />
                        </Grid>
                        {currentValues.name && currentValues.relation ? (
                            <Grid item xs={12} sm={1}>
                                <Button fullWidth onClick={addFormFields} variant="tonal"><i className='tabler-plus text-[22px]' /></Button>
                            </Grid>
                        ) : (
                            <Grid item xs={12} sm={1}>
                                <Button fullWidth variant="tonal" disabled><i className='tabler-plus text-[22px]' /></Button>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
