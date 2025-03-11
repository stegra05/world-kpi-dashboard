'use client'

import { useState, useEffect } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { Box, Heading, Spinner, Center, useColorMode, Select, HStack } from '@chakra-ui/react'

interface LineChartProps {
  title: string
  data: any[]
  dataKeys: string[]
  categoryKey: string
  colors?: string[]
  height?: number | string
  loading?: boolean
}

export function LineChartComponent({
  title,
  data,
  dataKeys,
  categoryKey,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  height = 300,
  loading = false
}: LineChartProps) {
  const { colorMode } = useColorMode()
  const [chartData, setChartData] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<string>('category')

  useEffect(() => {
    if (!data || data.length === 0) return

    // Sortiere die Daten
    let sortedData = [...data]
    if (sortBy === 'category') {
      sortedData.sort((a, b) => (a[categoryKey] as string).localeCompare(b[categoryKey] as string))
    } else if (sortBy === 'value') {
      // Sortiere nach dem ersten dataKey
      sortedData.sort((a, b) => (b[dataKeys[0]] as number) - (a[dataKeys[0]] as number))
    }

    // Begrenze auf die Top 10 Einträge
    setChartData(sortedData.slice(0, 10))
  }, [data, dataKeys, categoryKey, sortBy])

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
          <option value="category">Nach Kategorie</option>
          <option value="value">Nach Wert</option>
        </Select>
      </Box>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
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
          {dataKeys.map((key, index) => (
            <Line 
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              activeDot={{ r: 8 }}
              name={key}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}
