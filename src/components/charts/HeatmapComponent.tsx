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
import { Box, Heading, Spinner, Center } from '@chakra-ui/react'

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
  const [chartData, setChartData] = useState<any[]>([])

  // Format data for heatmap visualization
  useEffect(() => {
    if (!data || data.length === 0) return

    // Process data for the heatmap
    const processedData = data.map(item => ({
      x: item[xKey],
      y: item[yKey],
      z: item[valueKey] || 0
    }));

    setChartData(processedData)
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

  // Custom tooltip for the heatmap
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm">{`${xKey}: ${payload[0].payload.x}`}</p>
          <p className="text-sm">{`${yKey}: ${payload[0].payload.y}`}</p>
          <p className="text-sm font-bold">{`${valueKey}: ${payload[0].payload.z}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Box>
      <Heading size="md" mb={4}>{title}</Heading>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="x" 
            name={xKey} 
            tick={{ fill: "#1a202c" }}
          />
          <YAxis 
            dataKey="y" 
            name={yKey} 
            tick={{ fill: "#1a202c" }}
          />
          <ZAxis 
            dataKey="z" 
            range={[50, 1000]} 
            name={valueKey} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Scatter 
            data={chartData} 
            fill={colors[0]} 
            name={valueKey}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  )
}
