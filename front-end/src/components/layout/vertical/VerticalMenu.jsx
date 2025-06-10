'use client'

// Next Imports
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
// MUI Imports
import { useTheme } from '@mui/material/styles'
import cookie from 'cookie'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import CustomChip from '@core/components/mui/Chip'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'
// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'

import useUserRole from '@/libs/getSession'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const params = useParams()
  const { isBreakpointReached } = useVerticalNav()
  const [parsedCookies, setParsedCookies] = useState({})

  // Vars
  const { transitionDuration } = verticalNavOptions
  const { lang: locale, id } = params
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar
  const { role: userRole, loading } = useUserRole()

  useEffect(() => {
    const cookies = document.cookie // Access cookies from document
    const parsed = cookie.parse(cookies) // Parse cookies
    setParsedCookies(parsed) // Set state
  }, [])

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {userRole === 'admin' ?? (
          <MenuItem href={`/${locale}/dashboards`} icon={<i className='tabler-chart-pie-2' />}>
            {dictionary['navigation'].dashboards}
          </MenuItem>
        )}

        {userRole === 'admin' && (
          <MenuItem href={`/${locale}/pages/referTable1`} icon={<i className='tabler-user-plus' />}>
            ข้อมูลคนไข้
          </MenuItem>
        )}
        {/* <MenuItem href={`/${locale}/pages/referTable2`} icon={<i className='tabler-table' />}>
          ข้อมูลคนไข้
        </MenuItem>
        <MenuItem href={`/${locale}/pages/referTable3`} icon={<i className='tabler-table' />}>
          {dictionary['navigation'].referTable3}
        </MenuItem> */}

        {userRole === 'admin' || userRole === 'sadmin' || (userRole === 'doctor' && parsedCookies.refer === 'true') ? (
          <MenuItem href={`/${locale}/pages/refer`} icon={<i className='tabler-checkup-list' />}>
            รายการส่งปรึกษา/ส่งข้อมูล
          </MenuItem>
        ) : null}
        {userRole === 'admin' || userRole === 'sadmin' || (userRole === 'doctor' && parsedCookies.refer === 'false') ? (
          <MenuItem href={`/${locale}/pages/pending-refer`} icon={<i className='tabler-checkup-list' />}>
            ตอบรับปรึกษา
          </MenuItem>
        ) : null}

        {userRole === 'admin' ?? (
          <SubMenu label='ระบบเตียง' icon={<i className='tabler-bed' />}>
            <MenuItem href='#' icon={<i className='tabler-heartbeat' />}>
              {dictionary['navigation'].health}
            </MenuItem>
            <MenuItem href='#' icon={<i className='tabler-upload' />}>
              {dictionary['navigation'].upload}
            </MenuItem>
          </SubMenu>
        )}

        {userRole === 'admin' || userRole === 'sadmin' ? (
          <SubMenu label='การตั้งค่า' icon={<i className='tabler-settings' />}>
            <MenuItem href={`/${locale}/apps/setting/hospital-setting`} icon={<i className='tabler-id-badge-2' />}>
              ตั้งค่าโรงพยาบาล
            </MenuItem>
            <MenuItem href={`/${locale}/apps/setting/department-setting`} icon={<i className='tabler-building' />}>
              ตั้งค่าแผนก / หน่วยงาน
            </MenuItem>
            <MenuItem href={`/${locale}/apps/setting/user-setting`} icon={<i className='tabler-user-cog' />}>
              ตั้งค่าผู้ใช้
            </MenuItem>
          </SubMenu>
        ) : null}
      </Menu>
      {/* <Menu
          popoutMenuOffset={{ mainAxis: 23 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >
          <GenerateVerticalMenu menuData={menuData(dictionary, params)} />
        </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
