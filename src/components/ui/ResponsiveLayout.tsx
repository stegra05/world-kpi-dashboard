'use client'

import { useEffect } from 'react'
import { Box, useColorMode, useBreakpointValue } from '@chakra-ui/react'
import { MainLayout } from './layout'
import { MobileNavigation } from './MobileNavigation'
import { useIsMobile, useIsTablet } from './ResponsiveUtils'

interface ResponsiveLayoutProps {
  children: React.ReactNode
  title?: string
}

export function ResponsiveLayout({ children, title = 'World KPI Dashboard' }: ResponsiveLayoutProps) {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const { colorMode } = useColorMode()
  
  // Anpassen der Schriftgröße basierend auf der Bildschirmgröße
  const fontSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'md' })
  
  // Anpassen des Paddings basierend auf der Bildschirmgröße
  const padding = useBreakpointValue({ base: 2, md: 4, lg: 6 })
  
  // Setze die Schriftgröße für den gesamten Body
  useEffect(() => {
    if (fontSize) {
      document.body.style.fontSize = fontSize
    }
    
    return () => {
      document.body.style.fontSize = ''
    }
  }, [fontSize])
  
  if (isMobile) {
    return (
      <Box>
        <MobileNavigation title={title} />
        <Box p={padding} pt={0}>
          {children}
        </Box>
      </Box>
    )
  }
  
  // Für Tablets und Desktop die normale Layout-Komponente verwenden
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}
