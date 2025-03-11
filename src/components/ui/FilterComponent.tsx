'use client'

import { useState, useEffect } from 'react'
import { 
  Box, 
  Heading, 
  Select, 
  Stack, 
  FormControl, 
  FormLabel, 
  Flex,
  Button,
  useColorMode,
  Badge
} from '@chakra-ui/react'
import { preprocessData } from '@/data/preprocessing'

interface FilterComponentProps {
  onFilterChange: (filters: FilterValues) => void
  defaultValues?: FilterValues
}

export interface FilterValues {
  batteryType: string
  continent: string
  climate: string
  variable: string
}

export function FilterComponent({
  onFilterChange,
  defaultValues = {
    batteryType: 'all',
    continent: 'all',
    climate: 'all',
    variable: 'variable_1'
  }
}: FilterComponentProps) {
  const { colorMode } = useColorMode()
  const [filters, setFilters] = useState<FilterValues>(defaultValues)
  const [options, setOptions] = useState({
    batteryTypes: ['all'],
    continents: ['all'],
    climates: ['all'],
    variables: ['variable_1']
  })
  const [loading, setLoading] = useState(true)

  // Lade die verfügbaren Optionen für die Filter
  useEffect(() => {
    async function loadFilterOptions() {
      try {
        setLoading(true)
        const processedData = await preprocessData()
        const rawData = processedData.rawData

        // Extrahiere eindeutige Werte für die Filter
        const batteryTypes = ['all', ...Array.from(new Set(rawData.map(item => item.battAlias)))]
        const continents = ['all', ...Array.from(new Set(rawData.map(item => item.continent).filter(Boolean)))]
        const climates = ['all', ...Array.from(new Set(rawData.map(item => item.climate).filter(Boolean)))]
        const variables = Array.from(new Set(rawData.map(item => item.var).filter(Boolean)))

        setOptions({
          batteryTypes,
          continents,
          climates,
          variables
        })
        
        setLoading(false)
      } catch (error) {
        console.error('Fehler beim Laden der Filteroptionen:', error)
        setLoading(false)
      }
    }

    loadFilterOptions()
  }, [])

  // Aktualisiere die Filter und benachrichtige die übergeordnete Komponente
  const handleFilterChange = (field: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  // Setze alle Filter zurück
  const handleReset = () => {
    const resetFilters = {
      batteryType: 'all',
      continent: 'all',
      climate: 'all',
      variable: options.variables[0] || 'variable_1'
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <Box 
      p={4} 
      borderRadius="lg" 
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      boxShadow="md"
      border="1px"
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Daten filtern</Heading>
        <Button 
          size="sm" 
          colorScheme="blue" 
          variant="outline" 
          onClick={handleReset}
          isDisabled={loading}
        >
          Zurücksetzen
        </Button>
      </Flex>

      <Stack spacing={4}>
        <FormControl isDisabled={loading}>
          <FormLabel>Batterietyp</FormLabel>
          <Select 
            value={filters.batteryType}
            onChange={(e) => handleFilterChange('batteryType', e.target.value)}
          >
            {options.batteryTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'Alle Batterietypen' : type}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isDisabled={loading}>
          <FormLabel>Kontinent</FormLabel>
          <Select 
            value={filters.continent}
            onChange={(e) => handleFilterChange('continent', e.target.value)}
          >
            {options.continents.map(continent => (
              <option key={continent} value={continent}>
                {continent === 'all' ? 'Alle Kontinente' : continent}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isDisabled={loading}>
          <FormLabel>Klimazone</FormLabel>
          <Select 
            value={filters.climate}
            onChange={(e) => handleFilterChange('climate', e.target.value)}
          >
            {options.climates.map(climate => (
              <option key={climate} value={climate}>
                {climate === 'all' ? 'Alle Klimazonen' : climate}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isDisabled={loading}>
          <FormLabel>Variable</FormLabel>
          <Select 
            value={filters.variable}
            onChange={(e) => handleFilterChange('variable', e.target.value)}
          >
            {options.variables.map(variable => (
              <option key={variable} value={variable}>
                {variable}
              </option>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Box mt={4}>
        <Heading size="xs" mb={2}>Aktive Filter:</Heading>
        <Flex wrap="wrap" gap={2}>
          {filters.batteryType !== 'all' && (
            <Badge colorScheme="blue">Batterietyp: {filters.batteryType}</Badge>
          )}
          {filters.continent !== 'all' && (
            <Badge colorScheme="green">Kontinent: {filters.continent}</Badge>
          )}
          {filters.climate !== 'all' && (
            <Badge colorScheme="orange">Klimazone: {filters.climate}</Badge>
          )}
          <Badge colorScheme="purple">Variable: {filters.variable}</Badge>
        </Flex>
      </Box>
    </Box>
  )
}
