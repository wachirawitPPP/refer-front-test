// MUI Imports
'use client'
import Grid from '@mui/material/Grid'
import ProjectListTable from './ProjectListTable' 
// Component Imports
import UserDetails from './UserDetails' 

const UserLeftOverview = () => {
  return (
    <Grid container spacing={6} className='p-5'> 
      <Grid item xs={4}>
        <UserDetails />
      </Grid>
      <Grid item xs={8}>
        <ProjectListTable /> 
      </Grid> 
    </Grid>
  )
}

export default UserLeftOverview
