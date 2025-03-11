'use client'

import { useState, useEffect } from 'react'
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { Box, Heading, Spinner, Center, useColorMode, Select } from '@chakra-ui/react'

interface PieChartProps {
  title: string
  data: any[]
  dataKey: string
  nameKey: string
  colors?: string[]
  height?: number | string
  loading?: boolean
}

export function PieChartComponent({
  title,
  data,
  dataKey,
  nameKey,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#f43f5e', '#8b5cf6'],
  height = 300,
  loading = false
}: PieChartProps) {
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
      sortedData.sort((a, b) => (a[nameKey] as string).localeCompare(b[nameKey] as string))
    }

    // Begrenze auf die Top 10 Einträge
    setChartData(sortedData.slice(0, 10))
  }, [data, dataKey, nameKey, sortBy])

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
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colorMode === 'light' ? 'white' : '#1a202c',
              color: colorMode === 'light' ? '#1a202c' : 'white',
              border: `1px solid ${colorMode === 'light' ? '#e2e8f0' : '#2d3748'}`
            }}
            formatter={(value: any) => [`${value}`, dataKey]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  )
}
