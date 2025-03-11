'use client'

import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItemProps {
  icon: string
  children: string
  href: string
  isActive?: boolean
}

const NavItem = ({ icon, children, href, isActive }: NavItemProps) => {
  const colorMode = 'light'
  
  return (
    <Link href={href} passHref>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: colorMode === 'light' ? 'blue.50' : 'blue.900',
          color: colorMode === 'light' ? 'blue.600' : 'blue.200',
        }}
        bg={isActive ? (colorMode === 'light' ? 'blue.100' : 'blue.800') : 'transparent'}
        color={isActive ? (colorMode === 'light' ? 'blue.700' : 'blue.300') : 'inherit'}
      >
        <Text mr="4" fontSize="16px">{icon}</Text>
        <Text fontWeight={isActive ? 'medium' : 'normal'}>{children}</Text>
      </Flex>
    </Link>
  )
}

export function Navigation() {
  const pathname = usePathname()
  
  return (
    <Box pt={5}>
      <Box display="flex" flexDirection="column" gap={1}>
        <NavItem 
          icon="🏠" 
          href="/" 
          isActive={pathname === '/'}
        >
          Dashboard
        </NavItem>
        <NavItem 
          icon="📊" 
          href="/charts" 
          isActive={pathname === '/charts'}
        >
          Diagramme
        </NavItem>
        <NavItem 
          icon="🌐" 
          href="/map" 
          isActive={pathname === '/map'}
        >
          Weltkarte
        </NavItem>
        <NavItem 
          icon="⚙️" 
          href="/settings" 
          isActive={pathname === '/settings'}
        >
          Einstellungen
        </NavItem>
        <NavItem 
          icon="📄" 
          href="/reports" 
          isActive={pathname === '/reports'}
        >
          Berichte
        </NavItem>
        <NavItem 
          icon="ℹ️" 
          href="/about" 
          isActive={pathname === '/about'}
        >
          Über
        </NavItem>
      </Box>
    </Box>
  )
}
