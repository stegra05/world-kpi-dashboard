'use client'

import { Box, Flex, Container, useColorMode, IconButton, Heading } from '@chakra-ui/react'
import { useState } from 'react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

interface LayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: LayoutProps) {
  const { colorMode, toggleColorMode } = useColorMode()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <Flex direction="column" minH="100vh">
      {/* Header */}
      <Box 
        as="header" 
        bg={colorMode === 'light' ? 'white' : 'gray.800'} 
        borderBottom="1px" 
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
        py={4}
        px={6}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg">World KPI Dashboard</Heading>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </Flex>
      </Box>

      {/* Main content */}
      <Flex flex={1}>
        {/* Sidebar */}
        <Box
          as="aside"
          w={isSidebarOpen ? '250px' : '0'}
          bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}
          borderRight="1px"
          borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          transition="width 0.3s ease"
          overflow="hidden"
          position="sticky"
          top="72px"
          h="calc(100vh - 72px)"
        >
          <Box p={4}>
            {/* Sidebar content will go here */}
          </Box>
        </Box>

        {/* Main content area */}
        <Box flex={1} p={6} overflowX="hidden">
          <Container maxW="container.xl" px={0}>
            {children}
          </Container>
        </Box>
      </Flex>

      {/* Footer */}
      <Box 
        as="footer" 
        bg={colorMode === 'light' ? 'gray.100' : 'gray.800'} 
        py={4}
        px={6}
        borderTop="1px" 
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Box>© 2025 World KPI Dashboard</Box>
            <Box>Version 1.0.0</Box>
          </Flex>
        </Container>
      </Box>
    </Flex>
  )
}
