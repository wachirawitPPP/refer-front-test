'use client'
import React from 'react'
import { Typography, Link } from '@mui/material'
import { useRouter } from 'next/navigation'

const DoctorNavigation = () => {
  const router = useRouter()

  const setCookie = (name, value, days) => {
    let expires = ''
    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      expires = `; expires=${date.toUTCString()}`
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`
  }

  const handleReferClick = (status) => {
    setCookie('refer', status === 'refer' ? 'true' : 'false', 7)
    router.push(status === 'refer' ?  '/pages/refer':'/pages/pending-refer' )
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center h-screen '>
        <img
          src='/images/pages/navigation_doc.png'
          alt='navigation_doc'
          className='h-32 sm:h-48 md:h-60 lg:h-64 xl:h-72 mb-4' // Responsive height and margin for spacing
        />
        <Typography variant='h4' className='text-center mb-8 font-bold text-gray-800'>
          โปรดเลือก
        </Typography>

        <div className='w-full flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-6'>
          {/* First Button - ส่งปรึกษา */}
          <div
            className='relative w-4/5 sm:w-3/5 md:w-1/3 lg:w-1/4 m-2 text-center shadow-xl transform transition-transform duration-500 ease-out hover:scale-105 cursor-pointer rounded-2xl mx-4 border-2 border-transparent hover:border-blue-300 overflow-hidden'
            onClick={() => handleReferClick('refer')}
            style={{ backgroundColor: '#C4E1F6' }}
          >
        

    
            <div className='relative z-10 p-4'>
              <Typography variant='h5' className='text-blue-600 font-semibold'>
                ส่งปรึกษา
              </Typography>
              <div className='relative flex justify-end pr-4 pb-2'>
                <i className='tabler-arrow-right text-blue-500 text-3xl'></i>
              </div>
            </div>
          </div>

          {/* Second Button - ตอบปรึกษา */}
          <div
             className='relative w-4/5 sm:w-3/5 md:w-1/3 lg:w-1/4 m-2 text-center shadow-xl transform transition-transform duration-500 ease-out hover:scale-105 cursor-pointer rounded-2xl mx-4 border-2 border-transparent hover:border-green-300 overflow-hidden'
            onClick={() => handleReferClick('receive')}
            style={{ backgroundColor: '#E0FBE2' }}
          >
            {/* Content */}
            <div className='relative z-10 p-4'>
              <Typography variant='h5' className='text-green-600 font-semibold'>
                ตอบปรึกษา
              </Typography>
              <div className='relative flex justify-end pr-4 pb-2'>
                <i className='tabler-arrow-right text-green-500 text-3xl'></i>
              </div>
            </div>
          </div>
        </div>
        <footer className='text-center mt-8'>
        <p>
          <span className='text-gray-600'>{`© ${new Date().getFullYear()} Powered by `}</span>
          <Link href='https://www.apsth.com/' target='_blank' className='text-blue-500 uppercase'>
            APS_X Platform
          </Link>
        </p>
      </footer>
      </div>

     
    </>
  )
}

export default DoctorNavigation
