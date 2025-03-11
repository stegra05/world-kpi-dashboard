'use client'

import { useState, useEffect } from 'react'
import { Box, Heading, SimpleGrid, useColorMode } from '@chakra-ui/react'
import { MainLayout } from '@/components/ui/layout'
import { Navigation } from '@/components/ui/navigation'
import { FilterComponent, FilterValues } from '@/components/ui/FilterComponent'
import { MapComponent } from '@/components/map/MapComponent'

export default function FilteredMapPage() {
  const { colorMode } = useColorMode()
  const [filters, setFilters] = useState<FilterValues>({
    batteryType: 'all',
    continent: 'all',
    climate: 'all',
    variable: 'variable_1'
  })
  const [loading, setLoading] = useState(false)

  // Behandle Filteränderungen
  const handleFilterChange = (newFilters: FilterValues) => {
    setLoading(true)
    setFilters(newFilters)
    // Simuliere Ladezeit für die Kartenaktualisierung
    setTimeout(() => setLoading(false), 500)
  }

  return (
    <MainLayout>
      <Box as="aside">
        <Navigation />
      </Box>
      
      <Box as="main" py={6}>
        <Heading as="h1" size="xl" mb={6}>Interaktive Weltkarte</Heading>
        
        <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={6}>
          {/* Filterbereich */}
          <Box>
            <FilterComponent onFilterChange={handleFilterChange} />
          </Box>
          
          {/* Kartenbereich */}
          <Box gridColumn={{ base: "1", lg: "2 / span 3" }}>
            <Box 
              p={4} 
              borderRadius="lg" 
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              boxShadow="md"
              border="1px"
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
            >
              <MapComponent 
                title={`Weltweite Verteilung (${filters.variable})`} 
                height={600} 
              />
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </MainLayout>
  )
}
