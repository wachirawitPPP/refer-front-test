'use client'
import * as React from 'react';
import PropTypes from 'prop-types';
import { Card, Tabs, Tab, Box, Typography, Skeleton } from '@mui/material';

// Internal imports
import ReferTable from '@/views/pages/refer/refer-table';
import RecieveTable from '@/views/pages/refer/recieve-table';
import StatusTable from '@/views/pages/refer/ststus-table';

async function fetchUsers() {
   
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/refer-lists?sort=referDate:desc`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch users failed:', error);
        throw error;
    }
}

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);
    const [users, setUsers] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const fetchData = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <Card>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className='m-4'>
                    <Tab disabled label="รายการส่งตัว" />
                    <Tab disabled label="รายการรับตัว" />
                    <Tab disabled label="เสร็จสิ้น" />
                    <Tab disabled label="ยกเลิก" />
                </Tabs>
                <Skeleton variant="rectangular" height={40} className='m-6' />
                <Skeleton variant="rectangular" height={100} className='m-6' />
            </Card>
        );
    }

    return (
        <Card>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className='m-4 ' >
                <Tab label="รายการส่งตัว" {...a11yProps(0)} />
                <Tab label="รายการรับตัว" {...a11yProps(1)} />
                <Tab label="เสร็จสิ้น" {...a11yProps(2)} />
                <Tab label="ยกเลิก" {...a11yProps(3)} />
            </Tabs>

            <CustomTabPanel value={value} index={0}>
                <ReferTable tableData={users} onUpdate={fetchData} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <RecieveTable tableData={users} onUpdate={fetchData} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <StatusTable tableData={users} isSuccess={true} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <StatusTable tableData={users} isCancel={true} />
            </CustomTabPanel>
        </Card>
    );
}
