'use client'

import { Grid, GridItem, Box, useColorMode } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface GridLayoutProps {
  children: ReactNode
}

export function GridLayout({ children }: GridLayoutProps) {
  const { colorMode } = useColorMode()
  
  return (
    <Grid
      templateColumns={{ 
        base: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(4, 1fr)'
      }}
      gap={6}
    >
      {children}
    </Grid>
  )
}

interface GridItemCardProps {
  children: ReactNode
  colSpan?: { base?: number; md?: number; lg?: number; xl?: number }
  rowSpan?: { base?: number; md?: number; lg?: number; xl?: number }
}

export function GridItemCard({ 
  children, 
  colSpan = { base: 1, md: 1, lg: 1, xl: 1 },
  rowSpan = { base: 1, md: 1, lg: 1, xl: 1 }
}: GridItemCardProps) {
  const { colorMode } = useColorMode()
  
  return (
    <GridItem
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      <Box
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        p={5}
        borderRadius="lg"
        boxShadow="md"
        h="100%"
        border="1px"
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      >
        {children}
      </Box>
    </GridItem>
  )
}
