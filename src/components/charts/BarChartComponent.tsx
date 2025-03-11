'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { Box, Heading, Spinner, Center, useColorMode, Select } from '@chakra-ui/react'

interface BarChartProps {
  title: string
  data: any[]
  dataKey: string
  categoryKey: string
  colors?: string[]
  height?: number | string
  loading?: boolean
}

export function BarChartComponent({
  title,
  data,
  dataKey,
  categoryKey,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  height = 300,
  loading = false
}: BarChartProps) {
  const { colorMode } = useColorMode()
  const [chartData, setChartData] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<string>('value')

  useEffect(() => {
    if (!data || data.length === 0) return

    // Sortiere die Daten
    let sortedData = [...data]
    if (sortBy === 'value') {
      sortedData.sort((a, b) => (b[dataKey] as number) - (a[dataKey] as number))
    } else if (sortBy === 'alphabetical') {
      sortedData.sort((a, b) => (a[categoryKey] as string).localeCompare(b[categoryKey] as string))
    }

    // Begrenze auf die Top 10 Einträge
    setChartData(sortedData.slice(0, 10))
  }, [data, dataKey, categoryKey, sortBy])

  if (loading) {
    return (
      <Box>
        <Heading size="md" mb={4}>{title}</Heading>
        <Center h={height}>
          <Spinner size="xl" color="blue.500" />
        </Center>
      </Box>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Box>
        <Heading size="md" mb={4}>{title}</Heading>
        <Center h={height}>
          <Heading size="sm" color="gray.500">Keine Daten verfügbar</Heading>
        </Center>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">{title}</Heading>
        <Select 
          size="sm" 
          width="auto" 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="value">Nach Wert</option>
          <option value="alphabetical">Alphabetisch</option>
        </Select>
      </Box>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={colorMode === 'light' ? '#e2e8f0' : '#2d3748'} 
          />
          <XAxis 
            dataKey={categoryKey} 
            tick={{ fill: colorMode === 'light' ? '#1a202c' : '#e2e8f0' }}
          />
          <YAxis 
            tick={{ fill: colorMode === 'light' ? '#1a202c' : '#e2e8f0' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colorMode === 'light' ? 'white' : '#1a202c',
              color: colorMode === 'light' ? '#1a202c' : 'white',
              border: `1px solid ${colorMode === 'light' ? '#e2e8f0' : '#2d3748'}`
            }}
          />
          <Legend />
          <Bar 
            dataKey={dataKey} 
            fill={colors[0]} 
            name={dataKey} 
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
