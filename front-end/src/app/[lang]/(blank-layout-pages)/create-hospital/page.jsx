// Component Imports
import FirstLanding from '@views/FirstLanding'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { Grid } from '@mui/material'

export const metadata = {
  title: 'Register',
  description: 'Register to your account'
}

const RegisterPage = () => {
  // Vars
  const mode = getServerMode()

  return <Grid item xs={12}>
     <FirstLanding mode={mode} />
     
  </Grid>
}
 

export default RegisterPage
