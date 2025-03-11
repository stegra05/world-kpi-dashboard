'use client'

import { useState } from 'react'
import { 
  Box, 
  Drawer, 
  DrawerBody, 
  DrawerHeader, 
  DrawerOverlay, 
  DrawerContent, 
  DrawerCloseButton,
  IconButton,
  useDisclosure,
  useColorMode,
  Flex,
  Text
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { Navigation } from './navigation'
import { useIsMobile } from './ResponsiveUtils'

interface MobileNavigationProps {
  title?: string
}

export function MobileNavigation({ title = 'World KPI Dashboard' }: MobileNavigationProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode } = useColorMode()
  const isMobile = useIsMobile()
  
  if (!isMobile) return null
  
  return (
    <>
      <Flex 
        position="fixed" 
        top="0" 
        left="0" 
        right="0" 
        p={4} 
        bg={colorMode === 'light' ? 'white' : 'gray.800'} 
        borderBottom="1px" 
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
        zIndex={100}
        align="center"
        justify="space-between"
      >
        <IconButton
          aria-label="Open navigation"
          icon={<HamburgerIcon />}
          onClick={onOpen}
          variant="ghost"
        />
        <Text fontWeight="bold">{title}</Text>
        <Box width="40px" /> {/* Spacer for balance */}
      </Flex>
      
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {title}
          </DrawerHeader>
          <DrawerBody p={0}>
            <Navigation />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      
      {/* Spacer to prevent content from being hidden under the fixed header */}
      <Box height="60px" />
    </>
  )
}
