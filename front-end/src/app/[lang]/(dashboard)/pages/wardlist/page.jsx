import React from 'react'
import axios from 'axios'
import { Card, Typography, Grid } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import TableWardList from './table_ward_list'
import SumaryWardList from './sumary_ward_list'

// Data Imports
//import { getEcommerceData } from './db-dump/service'
// Component Imports

const PageList = async () => {
  // const data = [
  //     {
  //         id: 1,
  //         pt_name: 'นายทดสอบ ระบบ',
  //         hn: 'hn2324214214',
  //         an: 'an2141241242',
  //         age: '45',
  //         ward: '5',
  //         dept: 'กุมารเวชกรรมทั่วไป (28/15)',
  //         bed: '115',
  //         room: 'standard 105',
  //         cp: 'แพทย์ 1',
  //         status_bed: '1',
  //     },
  //     {
  //         id: 2,
  //         pt_name: 'นายนอน โรงบาล',
  //         hn: 'hn2324214214',
  //         an: 'an2141241242',
  //         age: '45',
  //         ward: '7',
  //         dept: 'อายุรกรรม',
  //         bed: '34',
  //         room: 'premier ',
  //         cp: 'แพทย์ 2',
  //         status_bed: '1',
  //     },
  //     {
  //         id: 3,
  //         pt_name: 'นายทดสอบ ระบบ1',
  //         hn: 'hnxxx-xxxx',
  //         an: 'anxxx-xx-xx',
  //         age: '35',
  //         ward: '8',
  //         dept: 'อายุรกรรม',
  //         bed: '125',
  //         room: 'standard 81',
  //         cp: 'แพทย์ 3',
  //         status_bed: '1',
  //     },
  //     {
  //         id: 4,
  //         pt_name: 'นายทดสอบ ระบบ2',
  //         hn: 'hn2324214214',
  //         an: 'an2141241242',
  //         age: '60',
  //         ward: '9',
  //         dept: 'อายุรกรรม',
  //         bed: '19',
  //         room: 'standard 911',
  //         cp: 'แพทย์ 1',
  //         status_bed: '1',
  //     },
  //     {
  //         id: 5,
  //         pt_name: 'นางสาวทดสอบ ระบบ3',
  //         hn: 'hnxxx-xxxx',
  //         an: 'anxxx-xx-xx',
  //         age: '28',
  //         ward: '5',
  //         dept: 'กุมารเวชกรรมทั่วไป (28/15)',
  //         bed: '15',
  //         room: 'deluxe 105',
  //         cp: 'แพทย์ 1',
  //         status_bed: '2',
  //     },
  //     {
  //         id: 6,
  //         pt_name: 'นายทดสอบ ระบบ',
  //         hn: 'hn-2324214214',
  //         an: 'an-2141241242',
  //         age: '45',
  //         ward: '5',
  //         dept: 'กุมารเวชกรรมทั่วไป (28/15)',
  //         bed: '115',
  //         room: 'standard 105',
  //         cp: 'แพทย์ 1',
  //         status_bed: '2',
  //     }
  // ]
  // const data = await getEcommerceData()
  // console.log("data", data)
  return (
    <Grid container spacing={6}> 
      <Grid item xs={12}>
        <SumaryWardList />
      </Grid>
      {/* <Grid item xs={12}>
        <TableWardList productData={data?.products} />
      </Grid> */}
    </Grid>
  )
}

export default PageList
