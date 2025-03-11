'use client'

import { useEffect, useState } from 'react'
import { Box, useBreakpointValue, useMediaQuery } from '@chakra-ui/react'

interface ResponsiveContainerProps {
  children: React.ReactNode
  mobileStyles?: React.CSSProperties
  tabletStyles?: React.CSSProperties
  desktopStyles?: React.CSSProperties
}

export function ResponsiveContainer({
  children,
  mobileStyles = {},
  tabletStyles = {},
  desktopStyles = {}
}: ResponsiveContainerProps) {
  const breakpoint = useBreakpointValue({ base: 'mobile', md: 'tablet', lg: 'desktop' })
  const [currentStyles, setCurrentStyles] = useState<React.CSSProperties>({})

  useEffect(() => {
    switch (breakpoint) {
      case 'mobile':
        setCurrentStyles(mobileStyles)
        break
      case 'tablet':
        setCurrentStyles(tabletStyles)
        break
      case 'desktop':
        setCurrentStyles(desktopStyles)
        break
      default:
        setCurrentStyles({})
    }
  }, [breakpoint, mobileStyles, tabletStyles, desktopStyles])

  return (
    <Box style={currentStyles}>
      {children}
    </Box>
  )
}

export function useIsMobile() {
  const [isMobile] = useMediaQuery("(max-width: 48em)")
  return isMobile
}

export function useIsTablet() {
  const [isTablet] = useMediaQuery("(min-width: 48em) and (max-width: 62em)")
  return isTablet
}

export function useIsDesktop() {
  const [isDesktop] = useMediaQuery("(min-width: 62em)")
  return isDesktop
}

export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Überprüfe, ob das Gerät Touch-fähig ist
    const isTouchCapable = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0

    setIsTouchDevice(isTouchCapable)
  }, [])

  return isTouchDevice
}

export function useResponsiveValue<T>(
  mobileValue: T,
  tabletValue: T,
  desktopValue: T
): T {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  if (isMobile) return mobileValue
  if (isTablet) return tabletValue
  return desktopValue
}
