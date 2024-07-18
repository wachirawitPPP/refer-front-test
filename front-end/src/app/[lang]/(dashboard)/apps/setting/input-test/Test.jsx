'use client'
import React, { useState } from 'react';
import axios from 'axios';
import CustomAutocomplete from '@core/components/mui/Autocomplete';
import CustomTextField from '@core/components/mui/TextField';

const IcdSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleInputChange = (event, value) => {
    setQuery(value);
    if (value.length > 0) {
      fetchIcdData(value);
    } else {
      setResults([]);
    }
  };

  

  const fetchIcdData = async (query) => {
    console.log(query,"query")
    try {
      const response = await axios.post('http://localhost:3000/api/apps/icd/', { query }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Ensure response data is an array
      if (Array.isArray(response.data)) {
        setResults(response.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      setResults([]); // Clear results in case of error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error:', error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error: No response received from the server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
      }
    }
  };

  const handleOptionSelect = (event, value) => {
    setSelectedOption(value);
    console.log('Selected ICD:', value);
    setResults([value]);
    // console.log()
    
  };
  

  return (
    <div>
      <CustomAutocomplete
        fullWidth
        options={results}
        getOptionLabel={(option) => `${option.code}: ${option.name_th}:${option.name_en}`}
        onInputChange={handleInputChange}
        onChange={handleOptionSelect}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            placeholder="Enter ICD code or description"
            label="ICD Search"
          />
        )}
      />
      <div>
        {selectedOption && (
          <p>Selected ICD: {selectedOption.code}: {selectedOption.name_en}</p>
        )}
      </div>
    </div>
  );
};

export default IcdSearch;
