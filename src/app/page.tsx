'use client'

import { useState, useEffect } from 'react'
import { Grid, Box, Heading, Text, Flex, Spinner, SimpleGrid } from '@chakra-ui/react'
import { MainLayout } from '@/components/ui/layout'
import { FilterComponent, FilterValues } from '@/components/ui/FilterComponent'
import { MapComponent } from '@/components/map/MapComponent'
import { BarChartComponent } from '@/components/charts/BarChartComponent'
import { LineChartComponent } from '@/components/charts/LineChartComponent'
import { PieChartComponent } from '@/components/charts/PieChartComponent'
import { HeatmapComponent } from '@/components/charts/HeatmapComponent'
import { preprocessData, BatteryData } from '@/data/preprocessing'

// Define the ProcessedData interface to match what preprocessData returns
interface ProcessedData {
  rawData: BatteryData[];
  cleanedData: BatteryData[];
  normalizedData: BatteryData[];
  continentData: any[];
  climateData: any[];
  batteryTypeData: any[];
  timeSeriesData: any[];
  geoData: any[];
  outliers: BatteryData[];
}

export default function Home() {
  const [data, setData] = useState<ProcessedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterValues>({
    batteryType: 'all',
    continent: 'all',
    climate: 'all',
    variable: 'variable_1'
  })

  // Load data when component mounts
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        // Mock data for development until API is ready
        const mockData = {
          rawData: [],
          cleanedData: [],
          normalizedData: [],
          continentData: [
            { continent: 'Europe', value: 3500, count: 150 },
            { continent: 'North America', value: 2800, count: 120 },
            { continent: 'Asia', value: 4200, count: 180 },
            { continent: 'Africa', value: 1200, count: 50 },
            { continent: 'South America', value: 1800, count: 75 },
            { continent: 'Oceania', value: 900, count: 30 }
          ],
          climateData: [
            { climate: 'coldland', value: 2200, count: 100 },
            { climate: 'normal', value: 3500, count: 180 },
            { climate: 'hotland', value: 2800, count: 120 }
          ],
          batteryTypeData: [
            { battAlias: 'Batt_1', value: 1500, count: 50 },
            { battAlias: 'Batt_2', value: 2300, count: 75 },
            { battAlias: 'Batt_3', value: 1800, count: 60 },
            { battAlias: 'Batt_4', value: 2700, count: 90 },
            { battAlias: 'Batt_5', value: 2100, count: 70 }
          ],
          timeSeriesData: [
            { date: '2023-01', value: 2500 },
            { date: '2023-02', value: 2700 },
            { date: '2023-03', value: 3100 },
            { date: '2023-04', value: 3400 },
            { date: '2023-05', value: 3200 },
            { date: '2023-06', value: 3600 }
          ],
          geoData: [
            { country: 'Germany', continent: 'Europe', climate: 'normal', value: 3800, count: 160, iso: 'DEU' },
            { country: 'United States', continent: 'North America', climate: 'normal', value: 3500, count: 140, iso: 'USA' },
            { country: 'China', continent: 'Asia', climate: 'normal', value: 4100, count: 170, iso: 'CHN' },
            { country: 'Japan', continent: 'Asia', climate: 'normal', value: 3900, count: 150, iso: 'JPN' },
            { country: 'Brazil', continent: 'South America', climate: 'hotland', value: 2800, count: 110, iso: 'BRA' }
          ],
          outliers: []
        };
        
        setData(mockData as ProcessedData);
        setLoading(false);
        
        // Uncomment when API is ready:
        // const processedData = await preprocessData();
        // setData(processedData as ProcessedData);
        // setLoading(false);
      } catch (err) {
        console.error('Fehler beim Laden der Daten:', err)
        setError('Die Daten konnten nicht geladen werden.')
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter function for data
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters)
    // Data filtering will be handled in components
  }

  // Render loading state
  if (loading) {
    return (
      <MainLayout>
        <Flex height="80vh" justifyContent="center" alignItems="center" direction="column" gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Daten werden geladen...</Text>
        </Flex>
      </MainLayout>
    )
  }

  // Render error state
  if (error) {
    return (
      <MainLayout>
        <Flex height="80vh" justifyContent="center" alignItems="center" direction="column" gap={4}>
          <Heading color="red.500" size="lg">Fehler</Heading>
          <Text>{error}</Text>
        </Flex>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Box>
        <Heading size="xl" mb={6}>Batterie-Performance Dashboard</Heading>
        <Text mb={6}>
          Dieses Dashboard visualisiert Batterie-Performance-Daten aus verschiedenen Ländern und Regionen. 
          Nutzen Sie die Filter, um spezifische Datenansichten zu erkunden.
        </Text>

        <SimpleGrid columns={{ base: 1, lg: 4 }} gap={6} mb={8}>
          <Box 
            gridColumn={{ base: "span 1", lg: "span 1" }}
            height={{ base: "auto" }}
            p={4}
            bg="white"
            boxShadow="md"
            borderRadius="lg"
          >
            <FilterComponent onFilterChange={handleFilterChange} />
          </Box>

          <Box 
            gridColumn={{ base: "span 1", lg: "span 3" }}
            height={{ base: "400px", md: "500px" }}
          >
            <MapComponent 
              title="Globale Übersicht" 
              height="100%" 
            />
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={8}>
          <Box 
            bg="white"
            p={4}
            borderRadius="lg"
            boxShadow="md"
          >
            <BarChartComponent 
              title="Top Länder nach Batterieleistung" 
              data={data?.geoData || []}
              dataKey="value"
              categoryKey="country"
            />
          </Box>

          <Box 
            bg="white"
            p={4}
            borderRadius="lg"
            boxShadow="md"
          >
            <PieChartComponent 
              title="Verteilung nach Kontinenten"
              data={data?.continentData || []}
              dataKey="value"
              nameKey="continent"
            />
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          <Box 
            bg="white"
            p={4}
            borderRadius="lg"
            boxShadow="md"
          >
            <LineChartComponent 
              title="Trend über Zeit" 
              data={data?.timeSeriesData || []}
              dataKeys={["value"]}
              categoryKey="date"
            />
          </Box>

          <Box 
            bg="white"
            p={4}
            borderRadius="lg"
            boxShadow="md"
          >
            <BarChartComponent 
              title="Batterietypen Vergleich" 
              data={data?.batteryTypeData || []}
              dataKey="value"
              categoryKey="battAlias"
            />
          </Box>
        </SimpleGrid>
      </Box>
    </MainLayout>
  );
}
