'use client'

import { useEffect } from 'react'
import { useColorMode, Button, Flex, Text, Box } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

interface ColorSchemeToggleProps {
  showLabel?: boolean
}

export function ColorSchemeToggle({ showLabel = true }: ColorSchemeToggleProps) {
  const { colorMode, toggleColorMode } = useColorMode()
  
  return (
    <Button
      onClick={toggleColorMode}
      size="md"
      variant="ghost"
      leftIcon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      aria-label={`Wechseln zum ${colorMode === 'light' ? 'Dunkelmodus' : 'Hellmodus'}`}
    >
      {showLabel && (colorMode === 'light' ? 'Dunkelmodus' : 'Hellmodus')}
    </Button>
  )
}

interface UserGuideBannerProps {
  onDismiss: () => void
  showBanner: boolean
}

export function UserGuideBanner({ onDismiss, showBanner }: UserGuideBannerProps) {
  const { colorMode } = useColorMode()
  
  if (!showBanner) return null
  
  return (
    <Box
      p={4}
      bg={colorMode === 'light' ? 'blue.50' : 'blue.900'}
      borderRadius="md"
      mb={6}
      border="1px"
      borderColor={colorMode === 'light' ? 'blue.200' : 'blue.700'}
    >
      <Flex justify="space-between" align="center">
        <Text>
          <strong>Willkommen im World KPI Dashboard!</strong> Nutzen Sie die Filter auf der linken Seite, 
          um die Daten anzupassen. Klicken Sie auf die Karte für detaillierte Länderinformationen.
        </Text>
        <Button size="sm" onClick={onDismiss} ml={4}>
          Verstanden
        </Button>
      </Flex>
    </Box>
  )
}

interface UserPreferencesProps {
  onSave: (preferences: any) => void
  preferences: any
}

export function UserPreferences({ onSave, preferences }: UserPreferencesProps) {
  const { colorMode } = useColorMode()
  
  // Hier könnten weitere Benutzereinstellungen implementiert werden
  
  return (
    <Box
      p={4}
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      borderRadius="md"
      boxShadow="md"
      border="1px"
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
    >
      <Text fontWeight="bold" mb={4}>Darstellung</Text>
      <Flex align="center" mb={2}>
        <Text flex="1">Farbmodus</Text>
        <ColorSchemeToggle showLabel={false} />
      </Flex>
    </Box>
  )
}
