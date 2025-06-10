'use client'
import React from 'react'
import axios from 'axios'
import { Card, Typography, Grid } from '@mui/material'
import BedCard from './bed-carad'

const data = [
    {
        id: 1,
        pt_name: 'นายทดสอบ ระบบ',
        hn:'hn2324214214',
        an:'an2141241242',
        age:'45',
        ward:'5',
        dept:'กุมารเวชกรรมทั่วไป (28/15)',
        bed:'115',
        room: 'standard 105',
        cp: 'แพทย์ 1',
        status_bed: '1',
    },
    {
        id: 2,
        pt_name: 'นายนอน โรงบาล',
        hn:'hn2324214214',
        an:'an2141241242',
        age:'45',
        ward:'7',
        dept:'อายุรกรรม',
        bed:'34',
        room: 'premier ',
        cp: 'แพทย์ 2',
        status_bed: '1',
    },
    {
        id: 3,
        pt_name: 'นายทดสอบ ระบบ1',
        hn:'hnxxx-xxxx',
        an:'anxxx-xx-xx',
        age:'35',
        ward:'8',
        dept:'อายุรกรรม',
        bed:'125',
        room: 'standard 81',
        cp: 'แพทย์ 3',
        status_bed: '1',
    },
    {
        id:4,
        pt_name: 'นายทดสอบ ระบบ2',
        hn:'hn2324214214',
        an:'an2141241242',
        age:'60',
        ward:'9',
        dept:'อายุรกรรม',
        bed:'19',
        room: 'standard 911',
        cp: 'แพทย์ 1',
        status_bed: '1',
    },
    {
        id:5,
        pt_name: 'นางสาวทดสอบ ระบบ3',
        hn:'hnxxx-xxxx',
        an:'anxxx-xx-xx',
        age:'28',
        ward:'5',
        dept:'กุมารเวชกรรมทั่วไป (28/15)',
        bed:'15',
        room: 'deluxe 105',
        cp: 'แพทย์ 1',
        status_bed: '2',
    },
    {
        id:6,
        pt_name: 'นายทดสอบ ระบบ',
        hn:'hn-2324214214',
        an:'an-2141241242',
        age:'45',
        ward:'5',
        dept:'กุมารเวชกรรมทั่วไป (28/15)',
        bed:'115',
        room: 'standard 105',
        cp: 'แพทย์ 1',
        status_bed: '2',
    }
]
const Wardboard = () => {
    return (
        <>
            <Grid item xs={12} className='space-y-3'>
                <Card className='w-full border-l-8 border-primary'>
                    <Typography className='p-2 ml-2 text-primary' variant='h5'>
                        Ward board
                    </Typography>
                </Card>
            </Grid>

            <Grid container spacing={2}> 
            {data.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={item.id}>
                        <BedCard
                            pt_name={item.pt_name}
                            hn={item.hn}
                            an={item.an}
                            age={item.age}
                            ward={item.ward}
                            dept={item.dept}
                            bed={item.bed}
                            room={item.room}
                            cp={item.cp}
                            status_bed={item.status_bed}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    )
}


export default Wardboard