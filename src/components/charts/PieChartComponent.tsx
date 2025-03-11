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
import { Box, Heading, Spinner, Center } from '@chakra-ui/react'

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

  // RADIAN für die Beschriftung
  const RADIAN = Math.PI / 180;
  
  // Custom Label für die Pie-Sections
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">{title}</Heading>
        <select 
          className="text-sm p-1 border border-gray-200 rounded"
          value={sortBy}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
        >
          <option value="value">Nach Wert</option>
          <option value="alphabetical">Alphabetisch</option>
        </select>
      </Box>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ 
              backgroundColor: "white",
              color: "#1a202c",
              border: "1px solid #e2e8f0"
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  )
}
