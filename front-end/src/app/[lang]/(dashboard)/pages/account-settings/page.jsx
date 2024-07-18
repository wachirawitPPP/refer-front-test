// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AccountSettings from '@views/pages/account-settings'

const AccountTab = dynamic(() => import('@views/pages/account-settings/account'))
const SecurityTab = dynamic(() => import('@views/pages/account-settings/security'))

const NotificationsTab = dynamic(() => import('@views/pages/account-settings/notifications'))
const ConnectionsTab = dynamic(() => import('@views/pages/account-settings/connections'))

// Vars
const tabContentList = () => ({
  account: <AccountTab />,
  security: <SecurityTab />,
  
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const AccountSettingsPage = () => {
  return <AccountSettings tabContentList={tabContentList()} />
}

export default AccountSettingsPage
