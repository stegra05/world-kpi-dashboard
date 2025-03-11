'use client'

import { useState, useEffect } from 'react'
import { Box, Heading, SimpleGrid, useColorMode } from '@chakra-ui/react'
import { MainLayout } from '@/components/ui/layout'
import { Navigation } from '@/components/ui/navigation'
import { FilterComponent, FilterValues } from '@/components/ui/FilterComponent'
import { ChartContainer } from '@/components/charts/ChartContainer'
import { preprocessData } from '@/data/preprocessing'
import { BatteryData } from '@/data/preprocessing/dataProcessor'

export default function ChartsPage() {
  const { colorMode } = useColorMode()
  const [filteredData, setFilteredData] = useState<BatteryData[]>([])
  const [filters, setFilters] = useState<FilterValues>({
    batteryType: 'all',
    continent: 'all',
    climate: 'all',
    variable: 'variable_1'
  })
  const [loading, setLoading] = useState(true)

  // Lade und filtere Daten basierend auf den ausgewählten Filtern
  useEffect(() => {
    async function loadAndFilterData() {
      try {
        setLoading(true)
        const processedData = await preprocessData()
        const rawData = processedData.rawData

        // Filtere die Daten basierend auf den ausgewählten Filtern
        let filtered = [...rawData]

        if (filters.batteryType !== 'all') {
          filtered = filtered.filter(item => item.battAlias === filters.batteryType)
        }

        if (filters.continent !== 'all') {
          filtered = filtered.filter(item => item.continent === filters.continent)
        }

        if (filters.climate !== 'all') {
          filtered = filtered.filter(item => item.climate === filters.climate)
        }

        if (filters.variable) {
          filtered = filtered.filter(item => item.var === filters.variable)
        }

        setFilteredData(filtered)
        setLoading(false)
      } catch (error) {
        console.error('Fehler beim Laden und Filtern der Daten:', error)
        setLoading(false)
      }
    }

    loadAndFilterData()
  }, [filters])

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
        <Heading as="h1" size="xl" mb={6}>Diagramme</Heading>
        
        <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={6}>
          {/* Filterbereich */}
          <Box>
            <FilterComponent onFilterChange={handleFilterChange} />
          </Box>
          
          {/* Diagrammbereich */}
          <Box gridColumn={{ base: "1", lg: "2 / span 3" }}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box 
                p={4} 
                borderRadius="lg" 
                bg={colorMode === 'light' ? 'white' : 'gray.800'}
                boxShadow="md"
                border="1px"
                borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              >
                <ChartContainer 
                  chartType="bar" 
                  title="Verteilung nach Ländern" 
                  dataType="country" 
                  loading={loading}
                />
              </Box>
              
              <Box 
                p={4} 
                borderRadius="lg" 
                bg={colorMode === 'light' ? 'white' : 'gray.800'}
                boxShadow="md"
                border="1px"
                borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              >
                <ChartContainer 
                  chartType="pie" 
                  title="Verteilung nach Kontinenten" 
                  dataType="continent" 
                  loading={loading}
                />
              </Box>
              
              <Box 
                p={4} 
                borderRadius="lg" 
                bg={colorMode === 'light' ? 'white' : 'gray.800'}
                boxShadow="md"
                border="1px"
                borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              >
                <ChartContainer 
                  chartType="line" 
                  title="Trendanalyse" 
                  dataType="batteryType" 
                  loading={loading}
                />
              </Box>
              
              <Box 
                p={4} 
                borderRadius="lg" 
                bg={colorMode === 'light' ? 'white' : 'gray.800'}
                boxShadow="md"
                border="1px"
                borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
              >
                <ChartContainer 
                  chartType="heatmap" 
                  title="Korrelationsanalyse" 
                  dataType="climate" 
                  loading={loading}
                />
              </Box>
            </SimpleGrid>
          </Box>
        </SimpleGrid>
      </Box>
    </MainLayout>
  )
}
