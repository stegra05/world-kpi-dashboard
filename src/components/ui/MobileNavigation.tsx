'use client'

import { useState } from 'react'
import { Box, Text } from '@chakra-ui/react'

interface MobileNavigationProps {
  title?: string
}

// Simplified placeholder component until dependencies are resolved
export function MobileNavigation({ title = 'World KPI Dashboard' }: MobileNavigationProps) {
  return (
    <Box p={4}>
      <Text>Mobile Navigation ({title})</Text>
    </Box>
  )
}
