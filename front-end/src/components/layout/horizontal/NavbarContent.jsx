'use client'

// Third-party Imports
import classnames from 'classnames'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState, useMemo } from 'react'
// Component Imports
import NavToggle from './NavToggle'
import Logo from '@components/layout/shared/Logo'
import NavSearch from '@components/layout/shared/search'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import ShortcutsDropdown from '@components/layout/shared/ShortcutsDropdown'
import NotificationsDropdown from '@components/layout/shared/NotificationsDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
const NavbarContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()
  const { data: session } = useSession()
  const [hospitalname, setHospitalname] = useState('')

  useEffect(() => {
    const fetchHospitalInfo = async () => {
      if (session) {
        try {
          const hos_id = session?.user?.hospitalId ?? 99999
          const response = await axios.get(`${process.env.NEXT_PUBLIC_TEST_API_URL}/hospital-info/${hos_id}`, {
            headers: {
              Authorization: session.user.token
            }
          })
          setHospitalname(response.data.data.name)
          console.log('Hospital:', response)
        } catch (error) {
          console.error('Failed to fetch hospital info:', error)
        }
      }
    }
    
    fetchHospitalInfo()
  }, [session])


  return (
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && <Logo />}
      </div>

      <div className='flex items-center'>
        {/* <LanguageDropdown /> */}
        {/* <ModeDropdown /> */}
        {/* <NotificationsDropdown notifications={notifications} /> */}
        <div className='w-30 flex flex-col items-end text-right'>
          <p className='text-sm font-medium text-gray-800'>ชื่อผู้ใช้: {session?.user?.name}</p>
          <div className='flex flex-row '>
            <p className='text-xs text-gray-500 mr-2'>
              สิทธิ:{' '}
              {session?.user?.role === 'doctor'
                ? 'แพทย์'
                : session?.user?.role === 'admin'
                  ? 'admin'
                  : session?.user?.role === 'nurse' ? 'พยาบาล' : session?.user?.role === 'regist' ? 'ห้องบัตร' : session?.user?.role}
            </p>
            <p className='text-xs text-gray-500'>สถานที่: {hospitalname}</p>
          </div>
        </div>
        <UserDropdown />
        {/* Language Dropdown, Notification Dropdown, quick access menu dropdown, user dropdown will be placed here */}
      </div>
    </div>
  )
}

export default NavbarContent
