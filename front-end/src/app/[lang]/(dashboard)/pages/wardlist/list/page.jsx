'use client'
import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import TableWardList from '../table_ward_list'
import { useSearchParams, useParams } from 'next/navigation'
//import { getEcommerceData } from '../db-dump/service'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import classnames from 'classnames'
import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'
import {CircularProgress } from '@mui/material'
const PageList = () => {
  const isBelowMdScreen = useMediaQuery(theme => theme.breakpoints.down('md'))
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const searchParams = useSearchParams()
  const dept = searchParams.get('dept') // Get the 'dept' query parameter
  const [productData, setProductData] = useState([])
  const [wardlist, setWardlist] = useState([])
  const { data: session, status } = useSession()
  useEffect(() => {
    console.log('Dept:', dept) // Log to verify the parameter

    // fectWardList()
  }, [dept])
  const fectWardList = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/sum_ward`, {
      params: {
        search_param: dept
      },
      headers: {
        Authorization: `${session?.user?.token}`
      }
    })
    const data = response.data
    setWardlist([data])
  }

  useEffect(() => {
    fectWardList()
  }, [])

  // const fetchData = async () => {
  //   try {
  //     const data = await getEcommerceData()
  //     setProductData(data.products)
  //     console.log('productData', data)
  //   } catch (error) {
  //     console.error('Error fetching data:', error)
  //   }
  // }

  // useEffect(() => {
  //   fetchData()
  // }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {wardlist.length < 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <CircularProgress />
              </div>
            ) : (
              <>
                {wardlist.map((item, index) => (
                  <div key={index}>
                    <div className='flex items-baseline gap-1 mbe-2'>
                      <Typography variant='h4'>
                        {item.wardname} ({item.wardcode})
                      </Typography>
                    </div>
                    <Grid container spacing={6}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        className={classnames({
                          '[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie':
                            isBelowMdScreen && !isSmallScreen,
                          '[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie': !isBelowMdScreen
                        })}
                      >
                        <div className='flex gap-6 max-md:flex-col md:items-center plb-6'>
                          <div className='md:is-8/12'>
                            <div className='flex flex-wrap justify-between gap-6 max-md:flex-col'>
                              <div className='flex gap-4'>
                                <CustomAvatar variant='rounded' skin='light' size={54} color={'primary'}>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='38'
                                    height='38'
                                    viewBox='0 0 38 38'
                                    fill='none'
                                  >
                                    <path
                                      opacity='0.2'
                                      d='M5.9375 26.125V10.6875C5.9375 10.0576 6.18772 9.45352 6.63312 9.00812C7.07852 8.56272 7.68261 8.3125 8.3125 8.3125H29.6875C30.3174 8.3125 30.9215 8.56272 31.3669 9.00812C31.8123 9.45352 32.0625 10.0576 32.0625 10.6875V26.125H5.9375Z'
                                      fill='currentColor'
                                    />
                                    <path
                                      d='M5.9375 26.125V10.6875C5.9375 10.0576 6.18772 9.45352 6.63312 9.00812C7.07852 8.56272 7.68261 8.3125 8.3125 8.3125H29.6875C30.3174 8.3125 30.9215 8.56272 31.3669 9.00812C31.8123 9.45352 32.0625 10.0576 32.0625 10.6875V26.125M21.375 13.0625H16.625M3.5625 26.125H34.4375V28.5C34.4375 29.1299 34.1873 29.734 33.7419 30.1794C33.2965 30.6248 32.6924 30.875 32.0625 30.875H5.9375C5.30761 30.875 4.70352 30.6248 4.25812 30.1794C3.81272 29.734 3.5625 29.1299 3.5625 28.5V26.125Z'
                                      stroke='currentColor'
                                      strokeWidth='2'
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                    />
                                  </svg>
                                </CustomAvatar>
                                <div>
                                  <Typography className='font-medium'>Total</Typography>
                                  <Typography variant='h4' color={`primary`}>
                                    {item.total} เตียง
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Divider orientation={'horizontal'} flexItem />
                        </div>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        className={classnames({
                          '[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie':
                            isBelowMdScreen && !isSmallScreen,
                          '[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie': !isBelowMdScreen
                        })}
                      >
                        <div className='flex gap-6 max-md:flex-col md:items-center plb-6'>
                          <div className='md:is-8/12'>
                            <div className='flex flex-wrap justify-between gap-6 max-md:flex-col'>
                              <div className='flex gap-4'>
                                <CustomAvatar variant='rounded' skin='light' size={54} color={'success'}>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='38'
                                    height='38'
                                    viewBox='0 0 38 38'
                                    fill='none'
                                  >
                                    <path
                                      opacity='0.2'
                                      d='M11.682 24.7885C10.2683 23.6892 9.1233 22.2826 8.33376 20.6753C7.54423 19.0679 7.13087 17.3019 7.125 15.5111C7.09532 9.06896 12.2758 3.71037 18.718 3.56193C21.2112 3.50283 23.6598 4.2302 25.7164 5.6409C27.7731 7.05159 29.3334 9.07399 30.176 11.4213C31.0187 13.7686 31.1009 16.3216 30.4111 18.7182C29.7213 21.1149 28.2944 23.2335 26.3328 24.7736C25.8995 25.1086 25.5485 25.5382 25.3067 26.0296C25.0648 26.521 24.9386 27.0611 24.9375 27.6088V28.4994C24.9375 28.8144 24.8124 29.1164 24.5897 29.3391C24.367 29.5618 24.0649 29.6869 23.75 29.6869H14.25C13.9351 29.6869 13.633 29.5618 13.4103 29.3391C13.1876 29.1164 13.0625 28.8144 13.0625 28.4994V27.6088C13.0588 27.0652 12.9328 26.5295 12.6938 26.0413C12.4548 25.553 12.109 25.1249 11.682 24.7885Z'
                                      fill='currentColor'
                                    />
                                    <path
                                      fillRule='evenodd'
                                      clipRule='evenodd'
                                      d='M25.1507 6.46554C23.2672 5.17364 21.0249 4.50752 18.7416 4.56165L18.7409 4.56167C18.4981 4.56726 18.2571 4.58096 18.0184 4.6025L18.6948 2.5622C21.3978 2.49826 24.0523 3.28688 26.282 4.81625C28.5118 6.34574 30.2035 8.53844 31.1171 11.0834C32.0307 13.6283 32.1199 16.3963 31.372 18.9948C30.6241 21.5933 29.077 23.8903 26.9503 25.5602L26.9443 25.5649L26.9443 25.5648C26.6316 25.8065 26.3783 26.1165 26.2038 26.4711C26.0293 26.8257 25.9382 27.2155 25.9374 27.6107V28.4994C25.9374 29.0796 25.7069 29.636 25.2967 30.0462C24.8865 30.4565 24.3301 30.6869 23.7499 30.6869H14.2499C13.6697 30.6869 13.1133 30.4565 12.7031 30.0462C12.2929 29.636 12.0624 29.0796 12.0624 28.4994V27.6125C12.0592 27.2201 11.968 26.8334 11.7955 26.4809C11.6229 26.1283 11.3734 25.819 11.0654 25.5758L11.7412 23.5373C11.9205 23.6971 12.1055 23.8511 12.2958 23.9991L11.6819 24.7885L12.3008 24.003C12.8456 24.4322 13.2869 24.9786 13.5919 25.6016C13.8968 26.2247 14.0576 26.9083 14.0624 27.602L14.0624 27.6088L14.0624 28.4994C14.0624 28.5492 14.0822 28.5969 14.1173 28.632C14.1525 28.6672 14.2002 28.6869 14.2499 28.6869H23.7499C23.7996 28.6869 23.8473 28.6672 23.8825 28.632C23.9176 28.5969 23.9374 28.5492 23.9374 28.4994V27.6088L23.9374 27.6069C23.9388 26.9067 24.1002 26.2162 24.4093 25.588C24.7179 24.961 25.1655 24.4128 25.7179 23.985C27.5129 22.5747 28.8186 20.6353 29.45 18.4416C30.0817 16.2468 30.0064 13.9088 29.2347 11.7592C28.463 9.60954 27.0341 7.75744 25.1507 6.46554ZM11.7411 23.5373L11.7412 23.5373L18.0184 4.6025L18.0178 4.60255L18.6942 2.56221C11.7041 2.72363 6.09308 8.5318 6.12491 15.5151C6.13137 17.4574 6.57975 19.3728 7.43609 21.1162C8.29203 22.8587 9.53309 24.3837 11.0654 25.5758L11.7411 23.5373ZM11.7411 23.5373C10.7006 22.6103 9.84758 21.4892 9.23122 20.2344C8.50859 18.7632 8.13026 17.1469 8.12489 15.5079L8.12489 15.5065C8.09882 9.84932 12.4635 5.10401 18.0178 4.60255L11.7411 23.5373ZM12.0625 34.437C12.0625 33.8847 12.5102 33.437 13.0625 33.437H24.9375C25.4898 33.437 25.9375 33.8847 25.9375 34.437C25.9375 34.9892 25.4898 35.437 24.9375 35.437H13.0625C12.5102 35.437 12.0625 34.9892 12.0625 34.437ZM20.3695 7.44477C19.825 7.35247 19.3087 7.71906 19.2164 8.26357C19.1241 8.80809 19.4907 9.32434 20.0352 9.41664C21.2825 9.62807 22.4333 10.2214 23.329 11.1148C24.2247 12.0082 24.821 13.1576 25.0356 14.4043C25.1293 14.9485 25.6465 15.3138 26.1907 15.2201C26.735 15.1264 27.1003 14.6092 27.0066 14.065C26.7217 12.4102 25.9303 10.8846 24.7414 9.69879C23.5526 8.51298 22.025 7.72541 20.3695 7.44477Z'
                                      fill='currentColor'
                                    />
                                  </svg>
                                </CustomAvatar>
                                <div>
                                  <Typography className='font-medium'>Occupied</Typography>
                                  <Typography variant='h4' color={`error`}>
                                    {item.discharge} เตียง
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        className={classnames({
                          '[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie':
                            isBelowMdScreen && !isSmallScreen,
                          '[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie': !isBelowMdScreen
                        })}
                      >
                        <div className='flex gap-6 max-md:flex-col md:items-center plb-6'>
                          <div className='md:is-8/12'>
                            <div className='flex flex-wrap justify-between gap-6 max-md:flex-col'>
                              <div className='flex gap-4'>
                                <CustomAvatar variant='rounded' skin='light' size={54} color={'success'}>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='38'
                                    height='38'
                                    viewBox='0 0 38 38'
                                    fill='none'
                                  >
                                    <path
                                      opacity='0.2'
                                      d='M11.682 24.7885C10.2683 23.6892 9.1233 22.2826 8.33376 20.6753C7.54423 19.0679 7.13087 17.3019 7.125 15.5111C7.09532 9.06896 12.2758 3.71037 18.718 3.56193C21.2112 3.50283 23.6598 4.2302 25.7164 5.6409C27.7731 7.05159 29.3334 9.07399 30.176 11.4213C31.0187 13.7686 31.1009 16.3216 30.4111 18.7182C29.7213 21.1149 28.2944 23.2335 26.3328 24.7736C25.8995 25.1086 25.5485 25.5382 25.3067 26.0296C25.0648 26.521 24.9386 27.0611 24.9375 27.6088V28.4994C24.9375 28.8144 24.8124 29.1164 24.5897 29.3391C24.367 29.5618 24.0649 29.6869 23.75 29.6869H14.25C13.9351 29.6869 13.633 29.5618 13.4103 29.3391C13.1876 29.1164 13.0625 28.8144 13.0625 28.4994V27.6088C13.0588 27.0652 12.9328 26.5295 12.6938 26.0413C12.4548 25.553 12.109 25.1249 11.682 24.7885Z'
                                      fill='currentColor'
                                    />
                                    <path
                                      fillRule='evenodd'
                                      clipRule='evenodd'
                                      d='M25.1507 6.46554C23.2672 5.17364 21.0249 4.50752 18.7416 4.56165L18.7409 4.56167C18.4981 4.56726 18.2571 4.58096 18.0184 4.6025L18.6948 2.5622C21.3978 2.49826 24.0523 3.28688 26.282 4.81625C28.5118 6.34574 30.2035 8.53844 31.1171 11.0834C32.0307 13.6283 32.1199 16.3963 31.372 18.9948C30.6241 21.5933 29.077 23.8903 26.9503 25.5602L26.9443 25.5649L26.9443 25.5648C26.6316 25.8065 26.3783 26.1165 26.2038 26.4711C26.0293 26.8257 25.9382 27.2155 25.9374 27.6107V28.4994C25.9374 29.0796 25.7069 29.636 25.2967 30.0462C24.8865 30.4565 24.3301 30.6869 23.7499 30.6869H14.2499C13.6697 30.6869 13.1133 30.4565 12.7031 30.0462C12.2929 29.636 12.0624 29.0796 12.0624 28.4994V27.6125C12.0592 27.2201 11.968 26.8334 11.7955 26.4809C11.6229 26.1283 11.3734 25.819 11.0654 25.5758L11.7412 23.5373C11.9205 23.6971 12.1055 23.8511 12.2958 23.9991L11.6819 24.7885L12.3008 24.003C12.8456 24.4322 13.2869 24.9786 13.5919 25.6016C13.8968 26.2247 14.0576 26.9083 14.0624 27.602L14.0624 27.6088L14.0624 28.4994C14.0624 28.5492 14.0822 28.5969 14.1173 28.632C14.1525 28.6672 14.2002 28.6869 14.2499 28.6869H23.7499C23.7996 28.6869 23.8473 28.6672 23.8825 28.632C23.9176 28.5969 23.9374 28.5492 23.9374 28.4994V27.6088L23.9374 27.6069C23.9388 26.9067 24.1002 26.2162 24.4093 25.588C24.7179 24.961 25.1655 24.4128 25.7179 23.985C27.5129 22.5747 28.8186 20.6353 29.45 18.4416C30.0817 16.2468 30.0064 13.9088 29.2347 11.7592C28.463 9.60954 27.0341 7.75744 25.1507 6.46554ZM11.7411 23.5373L11.7412 23.5373L18.0184 4.6025L18.0178 4.60255L18.6942 2.56221C11.7041 2.72363 6.09308 8.5318 6.12491 15.5151C6.13137 17.4574 6.57975 19.3728 7.43609 21.1162C8.29203 22.8587 9.53309 24.3837 11.0654 25.5758L11.7411 23.5373ZM11.7411 23.5373C10.7006 22.6103 9.84758 21.4892 9.23122 20.2344C8.50859 18.7632 8.13026 17.1469 8.12489 15.5079L8.12489 15.5065C8.09882 9.84932 12.4635 5.10401 18.0178 4.60255L11.7411 23.5373ZM12.0625 34.437C12.0625 33.8847 12.5102 33.437 13.0625 33.437H24.9375C25.4898 33.437 25.9375 33.8847 25.9375 34.437C25.9375 34.9892 25.4898 35.437 24.9375 35.437H13.0625C12.5102 35.437 12.0625 34.9892 12.0625 34.437ZM20.3695 7.44477C19.825 7.35247 19.3087 7.71906 19.2164 8.26357C19.1241 8.80809 19.4907 9.32434 20.0352 9.41664C21.2825 9.62807 22.4333 10.2214 23.329 11.1148C24.2247 12.0082 24.821 13.1576 25.0356 14.4043C25.1293 14.9485 25.6465 15.3138 26.1907 15.2201C26.735 15.1264 27.1003 14.6092 27.0066 14.065C26.7217 12.4102 25.9303 10.8846 24.7414 9.69879C23.5526 8.51298 22.025 7.72541 20.3695 7.44477Z'
                                      fill='currentColor'
                                    />
                                  </svg>
                                </CustomAvatar>
                                <div>
                                  <Typography className='font-medium'>Vacant</Typography>
                                  <Typography variant='h4' color={`success`}>
                                    {item.vacant} เตียง
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <TableWardList productData={productData} />
      </Grid>
    </Grid>
  )
}

export default PageList
