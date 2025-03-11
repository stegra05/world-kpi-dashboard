'use client'

import { useState } from 'react'
import { Box, Heading, Text } from '@chakra-ui/react'

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

// Simplified placeholder component until dependencies are resolved
export function FilterComponent({
  onFilterChange,
  defaultValues = {
    batteryType: 'all',
    continent: 'all',
    climate: 'all',
    variable: 'variable_1'
  }
}: FilterComponentProps) {
  const [filters] = useState<FilterValues>(defaultValues)

  return (
    <Box p={4} borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={4}>Daten filtern</Heading>
      <Text>Filterkomponente (vereinfacht)</Text>
      <Text mt={2}>Aktive Filter:</Text>
      <Text>Batterietyp: {filters.batteryType}</Text>
      <Text>Kontinent: {filters.continent}</Text>
      <Text>Klimazone: {filters.climate}</Text>
      <Text>Variable: {filters.variable}</Text>
    </Box>
  )
}
