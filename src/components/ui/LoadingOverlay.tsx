'use client'

import { ReactNode } from 'react'
import { Box, Spinner, Text, Center, useColorMode } from '@chakra-ui/react'

interface LoadingOverlayProps {
  isLoading: boolean
  text?: string
  children: ReactNode
  height?: string | number
}

export function LoadingOverlay({
  isLoading,
  text = 'Daten werden geladen...',
  children,
  height = 'auto'
}: LoadingOverlayProps) {
  const { colorMode } = useColorMode()
  
  return (
    <Box position="relative" minH={height}>
      {isLoading && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg={colorMode === 'light' ? 'whiteAlpha.800' : 'blackAlpha.800'}
          zIndex="10"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          borderRadius="lg"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
            color="blue.500"
            size="xl"
            mb={4}
          />
          <Text>{text}</Text>
        </Box>
      )}
      {children}
    </Box>
  )
}
