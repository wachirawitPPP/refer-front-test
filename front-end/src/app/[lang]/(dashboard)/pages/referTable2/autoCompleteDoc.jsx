import React, { useState } from 'react'

import relation from '@/data/relation.json'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete';
import CustomTextField from '@/@core/components/mui/TextField';



export default function AutoCompleteDoc() {

    const [currentValuesSelect, setCurrentValuesSelect] = useState({
        docName:[]
    });

    const mapData = relation.doctorName.map((item, index) => ({
        id: `${index + 1}`,
        title: item
    }));
    console.log(mapData,"mapData")

    // console.log(formValues,"formValues")
    const handleChangeSelect = (event, newValue) => {
        console.log(newValue, "newValue")
        console.log({ ...currentValuesSelect, docName: newValue }, "currentValues");
        if (event && event.target) {
            const { name, value } = event.target;
            setCurrentValuesSelect((prevValues) => ({
                ...prevValues,
                [name]: value,
            }));
            console.log({ ...currentValuesSelect, [name]: value }, "currentValues");
        } else {
            setCurrentValuesSelect((prevValues) => ({
                ...prevValues,
                docName: newValue,
        }));
    }
    
};
  return (
      <div>
          {/* <Grid container spacing={3}>
              <Grid item xs={12} md={4}></Grid>
              <Grid item xs={12} md={4}></Grid>
              <Grid item xs={12} md={4}> */}
                  <CustomAutocomplete
                      value={mapData.find(option=>option.title=="นายแพทย์ถานไถ จิ้น")||null}
                      name="docName"
                    //   defaultValue="นายแพทย์ถานไถ จิ้น"
                      // filterOptions={filterOptions}
                      // onChange={handleChange}
                      onChange={(event, newValue) => handleChangeSelect(null, newValue)}
                      // onChange={e => handleChange(e.target.value, "relation")}
                      options={mapData}
                      id='autocomplete-custom'
                      getOptionLabel={option => option.title || ''}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      renderInput={params => <CustomTextField placeholder='ค้นหาแพทย์ 3 ตัวอักษร' {...params} />}
                  />
               {/* </Grid>
           </Grid> */}
       </div>
  )
}
