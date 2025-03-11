'use client'

import { useEffect } from 'react'
import { Box, useColorMode, SimpleGrid, Flex } from '@chakra-ui/react'
import { useIsMobile, useIsTablet, useIsTouchDevice } from './ResponsiveUtils'

interface ResponsiveGridProps {
  children: React.ReactNode
  columns?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number }
  spacing?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number }
}

export function ResponsiveGrid({ 
  children, 
  columns = { base: 1, md: 2, lg: 3, xl: 4 },
  spacing = { base: 4, md: 6, lg: 6 }
}: ResponsiveGridProps) {
  return (
    <SimpleGrid 
      columns={columns}
      spacing={spacing}
      width="100%"
    >
      {children}
    </SimpleGrid>
  )
}

interface TouchFriendlyButtonProps {
  children: React.ReactNode
  onClick: () => void
  ariaLabel?: string
  isDisabled?: boolean
}

export function TouchFriendlyButton({
  children,
  onClick,
  ariaLabel,
  isDisabled = false
}: TouchFriendlyButtonProps) {
  const isTouchDevice = useIsTouchDevice()
  const { colorMode } = useColorMode()
  
  // Größere Klickfläche für Touch-Geräte
  const padding = isTouchDevice ? 4 : 3
  const minHeight = isTouchDevice ? '48px' : '36px'
  
  return (
    <Box
      as="button"
      aria-label={ariaLabel}
      onClick={onClick}
      px={padding}
      py={padding}
      minHeight={minHeight}
      borderRadius="md"
      bg={colorMode === 'light' ? 'blue.500' : 'blue.600'}
      color="white"
      fontWeight="medium"
      _hover={!isDisabled ? {
        bg: colorMode === 'light' ? 'blue.600' : 'blue.700',
      } : undefined}
      _active={!isDisabled ? {
        bg: colorMode === 'light' ? 'blue.700' : 'blue.800',
      } : undefined}
      opacity={isDisabled ? 0.6 : 1}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      transition="all 0.2s"
      userSelect="none"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {children}
    </Box>
  )
}

interface ResponsiveTypographyProps {
  children: React.ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small'
}

export function ResponsiveTypography({
  children,
  variant = 'body'
}: ResponsiveTypographyProps) {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  
  // Schriftgrößen basierend auf Gerät und Variante
  let fontSize: string
  let fontWeight: string
  let as: any = 'p'
  
  switch (variant) {
    case 'h1':
      fontSize = isMobile ? '1.75rem' : isTablet ? '2rem' : '2.25rem'
      fontWeight = 'bold'
      as = 'h1'
      break
    case 'h2':
      fontSize = isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem'
      fontWeight = 'bold'
      as = 'h2'
      break
    case 'h3':
      fontSize = isMobile ? '1.25rem' : isTablet ? '1.5rem' : '1.75rem'
      fontWeight = 'semibold'
      as = 'h3'
      break
    case 'h4':
      fontSize = isMobile ? '1.1rem' : isTablet ? '1.25rem' : '1.5rem'
      fontWeight = 'semibold'
      as = 'h4'
      break
    case 'small':
      fontSize = isMobile ? '0.75rem' : isTablet ? '0.8rem' : '0.875rem'
      fontWeight = 'normal'
      break
    case 'body':
    default:
      fontSize = isMobile ? '0.875rem' : isTablet ? '0.9rem' : '1rem'
      fontWeight = 'normal'
      break
  }
  
  return (
    <Box
      as={as}
      fontSize={fontSize}
      fontWeight={fontWeight}
      lineHeight={variant.startsWith('h') ? 'shorter' : 'normal'}
    >
      {children}
    </Box>
  )
}
