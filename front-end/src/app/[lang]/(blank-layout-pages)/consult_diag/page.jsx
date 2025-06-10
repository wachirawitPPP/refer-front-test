'use client'
// ReactImports
import { useState } from 'react'

// Next Imports
// import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { signIn } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string } from 'valibot'
import classnames from 'classnames'

// Component Imports
// import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
// import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { toast } from 'react-toastify'
// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const schema = object({
  username: string([minLength(1, 'This field is required')]),
  password: string([
    minLength(1, 'This field is required'),

  ])
})

const Login_demo = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState(null)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const Hospital = '/images/illustrations/auth/img_login.png'
  const logo1 = '/images/illustrations/auth/IPST_Logo.png'
  const logo2 = '/images/illustrations/auth/medicine.png'
  const logo3 = '/images/illustrations/auth/msdbkk.png'

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant('light', lightImg, darkImg)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const characterIllustration = useImageVariant(
    'light',
    // lightIllustration,
    // darkIllustration,
    // borderedLightIllustration,
    // borderedDarkIllustration
    //ems_login,
    //ems_login,
    //ems_login_no_background,
    Hospital,
    Hospital 
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit = async data => {
    const res = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false
    })

    if (res && res.ok && res.error === null) {
      // Vars
      
        toast.success('เข้าสู่ระบบสำเร็จ',{
          position: 'top-right',
          autoClose: 1000, // 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false
        });
        setTimeout(()=>{
          const redirectURL = searchParams.get('redirectTo') ?? '/'
          router.push(getLocalizedUrl(redirectURL, locale))
        },1000)

        //window.location.reload();
      

    } else {
      if (res?.error) {
        if (res.status === 401) {
          // If credentials are incorrect
          //alert("Username or Password is incorrect!");
          toast.warning('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!',{
            position: 'top-right',
            autoClose: 2000, // 5 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false
          });
          return;
        } else {
          // Other types of errors
          console.error(res.error);
          alert("An error occurred. Please try again.");
        }

        console.error(res.error)
        // setErrorState(res.error)
      }
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          {/* <Logo /> */}
        </div>
        <div className='flex flex-col gap-4 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
        <div className='flex justify-center'> 
            <img className='auth-illustration' style={{width:'60px', height:'60px'}} src={logo1} />
            <img className='auth-illustration' style={{width:'80px', height:'60px'}} src={logo2} />
            <img className='auth-illustration' style={{width:'60px', height:'60px'}} src={logo3} />
            </div> 
          <div >
            <Typography variant='h4' className='flex  gap-1 justify-center'>{`CONSULT NOAC`}<span style={{position:'relative',top:'-12px',left:'-5px'}}>®</span></Typography>
            <Typography variant='h4' className='flex  gap-1 justify-center'>{`Noac Application in BMA`}</Typography>
          </div> 
                    <Typography variant='body4' color='primary'>
              เข้าสู่ระบบ Consult Noac Application
            </Typography>
          {/* <Typography variant='body4' color='primary' className='flex justify-center'>
              เข้าสู่ระบบ Consult Noac Application in BMA
            </Typography> */}
          {/* <Alert icon={false} className='bg-[var(--mui-palette-primary-lightOpacity)]'>
            <Typography variant='body2' color='primary'>
              Username: <span className='font-medium'>admin</span> / Pass:{' '}
              <span className='font-medium'>admin</span>
            </Typography>
          </Alert> */}
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <Controller
              name='username'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  type='text'
                  label='Username'
                  placeholder='Enter your username'
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...((errors.username || errorState !== null) && {
                    error: true,
                    helperText: errors?.username?.message || errorState?.message[0]
                  })}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  placeholder='············'
                  id='login-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...(errors.password && { error: true, helperText: errors.password.message })}
                />
              )}
            />
            {/* <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' />
              <Typography
                className='text-end'
                color='primary'
                component={Link}
                href={getLocalizedUrl('/forgot-password', locale)}
              >
                Forgot password?
              </Typography>
            </div> */}
            <Button fullWidth variant='contained' type='submit'>
              Login
            </Button>
            {/* <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/register', locale)} color='primary'>
                Create an account
              </Typography>
            </div> */}

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login_demo
