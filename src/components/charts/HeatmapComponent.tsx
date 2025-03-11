'use client'

import { useState, useEffect } from 'react'
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { Box, Heading, Spinner, Center, useColorMode, Select, HStack } from '@chakra-ui/react'

interface HeatmapProps {
  title: string
  data: any[]
  xKey: string
  yKey: string
  valueKey: string
  colors?: string[]
  height?: number | string
  loading?: boolean
}

export function HeatmapComponent({
  title,
  data,
  xKey,
  yKey,
  valueKey,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  height = 300,
  loading = false
}: HeatmapProps) {
  const { colorMode } = useColorMode()
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (!data || data.length === 0) return

    // Formatiere die Daten für die Heatmap
    const formattedData = data.map(item => ({
      x: item[xKey],
      y: item[yKey],
      z: item[valueKey],
      name: `${item[xKey]} - ${item[yKey]}`
    }))

    setChartData(formattedData)
  }, [data, xKey, yKey, valueKey])

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
      </Box>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={colorMode === 'light' ? '#e2e8f0' : '#2d3748'} 
          />
          <XAxis 
            dataKey="x" 
            name={xKey}
            tick={{ fill: colorMode === 'light' ? '#1a202c' : '#e2e8f0' }}
          />
          <YAxis 
            dataKey="y" 
            name={yKey}
            tick={{ fill: colorMode === 'light' ? '#1a202c' : '#e2e8f0' }}
          />
          <ZAxis 
            dataKey="z" 
            range={[20, 500]} 
            name={valueKey} 
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ 
              backgroundColor: colorMode === 'light' ? 'white' : '#1a202c',
              color: colorMode === 'light' ? '#1a202c' : 'white',
              border: `1px solid ${colorMode === 'light' ? '#e2e8f0' : '#2d3748'}`
            }}
            formatter={(value: any, name: string) => [value, name]}
          />
          <Legend />
          <Scatter 
            name={valueKey} 
            data={chartData} 
            fill={colors[0]} 
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  )
}
