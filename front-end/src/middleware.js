// Next Imports
import { NextResponse } from 'next/server'
import cookie from 'cookie'
// Third-party Imports
import Negotiator from 'negotiator'
import { withAuth } from 'next-auth/middleware'
import { match as matchLocale } from '@formatjs/intl-localematcher'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getLocalizedUrl, isUrlMissingLocale } from '@/utils/i18n'
import { ensurePrefix, withoutSuffix } from '@/utils/string'

let DOCTOR_HOME_PAGE_URL = '/pages/refer'
const HOME_PAGE_URL = '/dashboards'
const DOCTOR_NAVIGATION_URL = '/doctor-navigation'

const DOCTOR_RESTRICTED_PATHS = [
  '/apps/setting/hospital-setting',
  '/setting/department-setting',
  '/apps/setting/user-setting',
  '/dashboards',
  '/pages/referTable1'
]

const getLocale = request => {
  const urlLocale = i18n.locales.find(locale => request.nextUrl.pathname.startsWith(`/${locale}`))
  if (urlLocale) return urlLocale

  const negotiatorHeaders = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const locales = i18n.locales
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)
  return matchLocale(languages, locales, i18n.defaultLocale)
}

const localizedRedirect = (url, locale, request) => {
  let _url = url
  const isLocaleMissing = isUrlMissingLocale(_url)

  if (isLocaleMissing) {
    _url = getLocalizedUrl(_url, locale ?? i18n.defaultLocale)
  }

  let _basePath = process.env.BASEPATH ?? ''
  _basePath = _basePath.replace('demo-1', request.headers.get('X-server-header') ?? 'demo-1')
  _url = ensurePrefix(_url, `${_basePath ?? ''}`)
  const redirectUrl = new URL(_url, request.url).toString()

  return NextResponse.redirect(redirectUrl)
}

export default withAuth(
  async function middleware(request) {
    const locale = getLocale(request)
    const pathname = request.nextUrl.pathname
    const searchParams = request.nextUrl.searchParams
    const cookies = cookie.parse(request.headers.get('cookie') || '')

    if (searchParams.has('token')) {
      return NextResponse.next()
    }

    const token = request.nextauth.token
    const isUserLoggedIn = !!token
    const userRole = token?.role

    const guestRoutes = ['login', 'authen', 'register', 'forgot-password', 'consult_diag', 'consult_diag_account']
    const sharedRoutes = ['shared-route']
    const privateRoute = ![...guestRoutes, ...sharedRoutes].some(route => pathname.endsWith(route))
    const isLoginAttempt = pathname.endsWith('/login') && isUserLoggedIn
    
    if (isLoginAttempt && userRole === 'doctor') {
      return localizedRedirect(DOCTOR_NAVIGATION_URL, locale, request)
    }


    if (userRole === 'doctor' && DOCTOR_RESTRICTED_PATHS.some(path => pathname.endsWith(path))) {
      return localizedRedirect(DOCTOR_NAVIGATION_URL, locale, request)
    }

    

    if (!isUserLoggedIn && privateRoute) {
      let redirectUrl = '/login'
      if (!(pathname === '/' || pathname === `/${locale}`)) {
        const searchParamsStr = new URLSearchParams({ redirectTo: withoutSuffix(pathname, '/') }).toString()
        redirectUrl += `?${searchParamsStr}`
      }
      return localizedRedirect(redirectUrl, locale, request)
    }

    
    const isRequestedRouteIsGuestRoute = guestRoutes.some(route => pathname.endsWith(route))

    if (isUserLoggedIn && isRequestedRouteIsGuestRoute) {
      if (userRole === 'admin') {
        return localizedRedirect(HOME_PAGE_URL, locale, request)
      }
      if (userRole === 'nurse'|| userRole === 'regist') {
        //return localizedRedirect('/pages/pending-refer', locale, request)
        return localizedRedirect(DOCTOR_NAVIGATION_URL, locale, request)
      }

      if (userRole === 'doctor') {
        return localizedRedirect(DOCTOR_NAVIGATION_URL, locale, request)
      }
    }

    if (pathname === '/' || pathname === `/${locale}`) {
      if (userRole === 'admin') return localizedRedirect(HOME_PAGE_URL, locale, request)
      if (userRole === 'doctor') return localizedRedirect(DOCTOR_NAVIGATION_URL, locale, request)
      if (userRole === 'nurse') return localizedRedirect(DOCTOR_NAVIGATION_URL, locale, request)
      //if (userRole === 'nurse') return localizedRedirect('/pages/pending-refer', locale, request)
    }

    return isUrlMissingLocale(pathname) ? localizedRedirect(pathname, locale, request) : NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true
    }
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.+?/hook-examples|.+?/menu-examples|images|next.svg|vercel.svg).*)'
  ]
}
