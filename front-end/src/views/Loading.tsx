import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

const Loading = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
           margin={6}
           gap={4}
           
            height="100vh"
          
            // sx={{ 
            //     backgroundColor: '#f5f5f5', 
            //     p: 3, 
            //     borderRadius: 2, 
            //     boxShadow: 3 
            // }}
        >
            {/* <Skeleton 
                variant="circular" 
                width={80} 
                height={80} 
                sx={{ mb: 3 }} 
            /> */}
            <Skeleton 
                variant="rounded" 
                className='w-full h-24'
                sx={{ mb: 1 }} 
            />
            <Skeleton 
                variant="rounded" 
                className='w-full h-80'
                sx={{ mb: 1 }} 
            />
            {/* <Skeleton 
                variant="text" 
                width={150} 
                height={30} 
            /> */}
        </Box>
    );
};

export default Loading;
