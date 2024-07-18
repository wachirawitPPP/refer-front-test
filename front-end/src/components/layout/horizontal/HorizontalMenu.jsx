// Do not remove this following 'use client' else SubMenu rendered in vertical menu on smaller screen will not work.
'use client'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Component Imports
import HorizontalNav, { Menu, SubMenu, MenuItem } from '@menu/horizontal-menu'
import VerticalNavContent from './VerticalNavContent'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'
import menuRootStyles from '@core/styles/horizontal/menuRootStyles'
import verticalNavigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
import verticalMenuItemStyles from '@core/styles/vertical/menuItemStyles'
import verticalMenuSectionStyles from '@core/styles/vertical/menuSectionStyles'

import useUserRole from '@/libs/getSession'; // Adjust the import path as needed

const RenderExpandIcon = ({ level }) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <i className='tabler-chevron-right' />
  </StyledHorizontalNavExpandIcon>
)

const RenderVerticalExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const HorizontalMenu = ({ dictionary }) => {
  // Hooks
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()
  const { settings } = useSettings()
  const params = useParams()

  // Vars
  const { skin } = settings
  const { transitionDuration } = verticalNavOptions
  const { lang: locale, id } = params
  const { role: userRole, loading } = useUserRole();

  console.log(userRole)

  if (loading) {
    return <div></div>; // Or any loading indicator
  }

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor:
          skin === 'bordered' ? 'var(--mui-palette-background-paper)' : 'var(--mui-palette-background-default)'
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
        menuItemStyles={menuItemStyles(settings, theme)}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        popoutMenuOffset={{
          mainAxis: ({ level }) => (level && level > 0 ? 14 : 12),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme, settings),
          renderExpandIcon: ({ open }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='tabler-circle text-xs' /> },
          menuSectionStyles: verticalMenuSectionStyles(verticalNavOptions, theme)
        }}
      >
        <MenuItem href={`/${locale}/dashboards`} icon={<i className='tabler-chart-pie-2' />}>
          {dictionary['navigation'].dashboards}
        </MenuItem>

        <MenuItem href={`/${locale}/pages/referTable1`} icon={<i className='tabler-user-plus' />}>
          ข้อมูลคนไข้
        </MenuItem>

        <MenuItem href={`/${locale}/pages/refer`} icon={<i className='tabler-checkup-list' />}>
          ระบบส่งตัว
        </MenuItem>
        <MenuItem href={`/${locale}/pages/pending-refer`} icon={<i className='tabler-checkup-list' />}>
          ตอบรับปรึกษา
        </MenuItem>
       
        {userRole === 'admin' || userRole === 'sadmin' ? (
          <SubMenu label='ระบบเตียง' icon={<i className='tabler-bed' />}>
            <MenuItem href='#' icon={<i className='tabler-heartbeat' />}>
              {dictionary['navigation'].health}
            </MenuItem>
            <MenuItem href='#' icon={<i className='tabler-upload' />}>
              {dictionary['navigation'].upload}
            </MenuItem>
          </SubMenu>
        ) : null}
        

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
        ):null}
        
      </Menu>
    </HorizontalNav>
  )
}

export default HorizontalMenu
