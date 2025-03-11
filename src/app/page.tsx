'use client'

import { useState } from 'react'
import { Box, Heading, Text, SimpleGrid, Flex, useColorMode } from '@chakra-ui/react'
import { MainLayout } from '@/components/ui/layout'
import { Navigation } from '@/components/ui/navigation'
import { GridLayout, GridItemCard } from '@/components/ui/grid'
import { FilterComponent, FilterValues } from '@/components/ui/FilterComponent'
import { ChartContainer } from '@/components/charts/ChartContainer'
import { MapComponent } from '@/components/map/MapComponent'

export default function DashboardPage() {
  const { colorMode } = useColorMode()
  const [filters, setFilters] = useState<FilterValues>({
    batteryType: 'all',
    continent: 'all',
    climate: 'all',
    variable: 'variable_1'
  })
  
  // Behandle Filteränderungen
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters)
  }
  
  return (
    <MainLayout>
      <Box as="aside">
        <Navigation />
      </Box>
      
      <Box as="main" py={6}>
        <Heading as="h1" size="xl" mb={6}>Dashboard</Heading>
        
        <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={6} mb={6}>
          {/* Filterbereich */}
          <Box>
            <FilterComponent onFilterChange={handleFilterChange} />
          </Box>
          
          {/* KPI-Karten */}
          <Box gridColumn={{ base: "1", lg: "2 / span 3" }}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box 
                bg={colorMode === 'light' ? 'white' : 'gray.800'} 
                p={5} 
                borderRadius="lg" 
                boxShadow="md"
                border="1px"
                borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              >
                <Text fontSize="sm" color="gray.500">Ausgewählter Batterietyp</Text>
                <Heading size="lg">{filters.batteryType === 'all' ? 'Alle' : filters.batteryType}</Heading>
              </Box>
              
              <Box 
                bg={colorMode === 'light' ? 'white' : 'gray.800'} 
                p={5} 
                borderRadius="lg" 
                boxShadow="md"
                border="1px"
                borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              >
                <Text fontSize="sm" color="gray.500">Ausgewählter Kontinent</Text>
                <Heading size="lg">{filters.continent === 'all' ? 'Alle' : filters.continent}</Heading>
              </Box>
              
              <Box 
                bg={colorMode === 'light' ? 'white' : 'gray.800'} 
                p={5} 
                borderRadius="lg" 
                boxShadow="md"
                border="1px"
                borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              >
                <Text fontSize="sm" color="gray.500">Ausgewählte Variable</Text>
                <Heading size="lg">{filters.variable}</Heading>
              </Box>
            </SimpleGrid>
          </Box>
        </SimpleGrid>
        
        <GridLayout>
          {/* Diagramme */}
          <GridItemCard colSpan={{ base: 1, md: 2, lg: 2 }}>
            <ChartContainer 
              chartType="bar" 
              title="Verteilung nach Ländern" 
              dataType="country" 
            />
          </GridItemCard>
          
          <GridItemCard colSpan={{ base: 1, md: 1, lg: 1 }}>
            <ChartContainer 
              chartType="pie" 
              title="Verteilung nach Kontinenten" 
              dataType="continent" 
            />
          </GridItemCard>
          
          <GridItemCard colSpan={{ base: 1, md: 1, lg: 1 }}>
            <ChartContainer 
              chartType="pie" 
              title="Verteilung nach Klimazonen" 
              dataType="climate" 
            />
          </GridItemCard>
          
          <GridItemCard colSpan={{ base: 1, md: 2, lg: 3 }}>
            <Heading size="md" mb={4}>Weltweite Verteilung</Heading>
            <Box height="300px">
              <MapComponent 
                title="" 
                height="100%" 
              />
            </Box>
          </GridItemCard>
          
          <GridItemCard colSpan={{ base: 1, md: 2, lg: 1 }}>
            <ChartContainer 
              chartType="line" 
              title="Trendanalyse" 
              dataType="batteryType" 
            />
          </GridItemCard>
        </GridLayout>
      </Box>
    </MainLayout>
  )
}
