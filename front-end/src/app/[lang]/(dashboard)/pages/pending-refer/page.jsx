'use client'
import React from 'react';
import RecieveTable from '@/views/pages/refer/recieve-table';


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



const PendingRefer = () => {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
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
    return (
        <RecieveTable tableData={users} />
    );
}

export default PendingRefer;
