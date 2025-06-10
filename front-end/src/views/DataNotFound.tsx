import React from 'react';
import { Box, Typography, Button, Paper, Card } from '@mui/material';
import { useRouter } from 'next/navigation';


const DataNotFound = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <Box className='flex flex-col justify-center items-center h-50px'
        >
          
                <img width={200} src="/images/misc/some-thing-went-wrong.png" />
            
            <Typography variant="h4" gutterBottom>
                ไม่มีข้อมูลในวันนี้
            </Typography>
            {/* <Typography variant="body1" color="textSecondary" gutterBottom>
                มีบางอย่างผิดปกติ โปรดลองใหม่ในภายหลัง
            </Typography> */}
            <Box mt={3}>
                {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGoBack}
                    sx={{
                        textTransform: 'none',
                        px: 4
                    }}
                >
                    กลับสู่หน้าหลัก
                </Button> */}
            </Box>
        </Box>
    );
};

export default DataNotFound;
