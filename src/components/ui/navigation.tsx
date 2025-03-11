'use client'

import { Box, Flex, Text, VStack, Icon, useColorMode } from '@chakra-ui/react'
import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Icons
import { 
  HiHome, 
  HiChartBar, 
  HiGlobe, 
  HiAdjustments, 
  HiInformationCircle,
  HiDocumentReport
} from 'react-icons/hi'

interface NavItemProps {
  icon: ReactNode
  children: string
  href: string
  isActive?: boolean
}

const NavItem = ({ icon, children, href, isActive }: NavItemProps) => {
  const { colorMode } = useColorMode()
  
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
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        <Text fontWeight={isActive ? 'medium' : 'normal'}>{children}</Text>
      </Flex>
    </Link>
  )
}

export function Navigation() {
  const pathname = usePathname()
  
  return (
    <Box pt={5}>
      <VStack spacing={1} align="stretch">
        <NavItem 
          icon={HiHome} 
          href="/" 
          isActive={pathname === '/'}
        >
          Dashboard
        </NavItem>
        <NavItem 
          icon={HiChartBar} 
          href="/charts" 
          isActive={pathname === '/charts'}
        >
          Diagramme
        </NavItem>
        <NavItem 
          icon={HiGlobe} 
          href="/map" 
          isActive={pathname === '/map'}
        >
          Weltkarte
        </NavItem>
        <NavItem 
          icon={HiAdjustments} 
          href="/settings" 
          isActive={pathname === '/settings'}
        >
          Einstellungen
        </NavItem>
        <NavItem 
          icon={HiDocumentReport} 
          href="/reports" 
          isActive={pathname === '/reports'}
        >
          Berichte
        </NavItem>
        <NavItem 
          icon={HiInformationCircle} 
          href="/about" 
          isActive={pathname === '/about'}
        >
          Über
        </NavItem>
      </VStack>
    </Box>
  )
}
