// Next Imports
import { Sarabun,Kanit } from 'next/font/google'

// Theme Options Imports
import overrides from './overrides'
import colorSchemes from './colorSchemes'
import spacing from './spacing'
import shadows from './shadows'
import customShadows from './customShadows'
import typography from './typography'





const public_sans = Kanit({ subsets: ['latin','thai'], weight: ['300', '400', '500', '600', '700', '800','900'] })
const public_sans2 = Sarabun({ subsets: ['thai'], weight: ['300', '400', '500', '600', '700', '800'] })

// const font_family = { public_kanit, public_sans}

const theme = (settings, mode, direction) => {
  return {
    direction,
    components: overrides(settings.skin),
    colorSchemes: colorSchemes(settings.skin),
    ...spacing,
    shape: {
      borderRadius: 6,
      customBorderRadius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10
      }
    },
    shadows: shadows(mode),
    typography: (typography(public_sans.style.fontFamily)),
    customShadows: customShadows(mode),
    mainColorChannels: {
      light: '47 43 61',
      dark: '225 222 245',
      lightShadow: '47 43 61',
      darkShadow: '19 17 32'
    }
  }
}

export default theme
