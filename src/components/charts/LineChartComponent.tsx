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
import { Box, Heading, Spinner, Center } from '@chakra-ui/react'

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
  const [chartData, setChartData] = useState<any[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>(dataKeys)

  useEffect(() => {
    if (!data || data.length === 0) return
    setChartData(data.slice(0, 20)) // Limit to 20 data points for performance
    setSelectedKeys(dataKeys)
  }, [data, dataKeys])

  const toggleDataKey = (key: string) => {
    if (selectedKeys.includes(key)) {
      // Only remove if there would still be at least one key selected
      if (selectedKeys.length > 1) {
        setSelectedKeys(selectedKeys.filter(k => k !== key))
      }
    } else {
      setSelectedKeys([...selectedKeys, key])
    }
  }

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
      <Heading size="md" mb={4}>{title}</Heading>
      
      {/* Data series toggles */}
      {dataKeys.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {dataKeys.map((key, idx) => (
            <button
              key={key}
              onClick={() => toggleDataKey(key)}
              className={`px-2 py-1 text-xs rounded-full ${
                selectedKeys.includes(key) 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      )}
      
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
            stroke="#e2e8f0"
          />
          <XAxis 
            dataKey={categoryKey} 
            tick={{ fill: "#1a202c" }}
          />
          <YAxis 
            tick={{ fill: "#1a202c" }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "white",
              color: "#1a202c",
              border: "1px solid #e2e8f0"
            }}
          />
          <Legend />
          
          {selectedKeys.map((key, idx) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[idx % colors.length]}
              activeDot={{ r: 8 }}
              name={key}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}
