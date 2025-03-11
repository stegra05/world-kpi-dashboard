'use client'

import { useEffect, useState } from 'react'
import { Box, Heading, Spinner, Center } from '@chakra-ui/react'
import { preprocessData } from '@/data/preprocessing'
import { BarChartComponent } from './BarChartComponent'
import { LineChartComponent } from './LineChartComponent'
import { PieChartComponent } from './PieChartComponent'
import { HeatmapComponent } from './HeatmapComponent'

interface ChartContainerProps {
  chartType: 'bar' | 'line' | 'pie' | 'heatmap'
  title: string
  dataType: 'continent' | 'climate' | 'batteryType' | 'country'
  height?: number | string
}

export function ChartContainer({
  chartType,
  title,
  dataType,
  height = 300
}: ChartContainerProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const processedData = await preprocessData()
        
        // Wähle die entsprechenden Daten basierend auf dataType
        let chartData: any[] = []
        
        switch (dataType) {
          case 'continent':
            chartData = processedData.continentData
            break
          case 'climate':
            chartData = processedData.climateData
            break
          case 'batteryType':
            chartData = processedData.batteryTypeData
            break
          case 'country':
            // Für Länder nehmen wir die Geodaten und transformieren sie
            chartData = processedData.geoData.map((item: any) => ({
              country: item.country,
              value: item.value,
              count: item.count,
              vehicleCount: item.vehicleCount
            }))
            break
          default:
            chartData = []
        }
        
        setData(chartData)
      } catch (err) {
        console.error('Fehler beim Laden der Daten:', err)
        setError('Fehler beim Laden der Daten')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [dataType])

  if (error) {
    return (
      <Box>
        <Heading size="md" mb={4}>{title}</Heading>
        <Center h={height}>
          <Heading size="sm" color="red.500">{error}</Heading>
        </Center>
      </Box>
    )
  }

  // Rendere den entsprechenden Diagrammtyp
  switch (chartType) {
    case 'bar':
      return (
        <BarChartComponent
          title={title}
          data={data}
          dataKey="avg"
          categoryKey={getCategoryKey(dataType)}
          loading={loading}
          height={height}
        />
      )
    case 'line':
      return (
        <LineChartComponent
          title={title}
          data={data}
          dataKeys={['avg', 'count']}
          categoryKey={getCategoryKey(dataType)}
          loading={loading}
          height={height}
        />
      )
    case 'pie':
      return (
        <PieChartComponent
          title={title}
          data={data}
          dataKey="count"
          nameKey={getCategoryKey(dataType)}
          loading={loading}
          height={height}
        />
      )
    case 'heatmap':
      return (
        <HeatmapComponent
          title={title}
          data={data}
          xKey={getCategoryKey(dataType)}
          yKey="count"
          valueKey="avg"
          loading={loading}
          height={height}
        />
      )
    default:
      return (
        <Box>
          <Heading size="md" mb={4}>{title}</Heading>
          <Center h={height}>
            <Heading size="sm" color="gray.500">Unbekannter Diagrammtyp</Heading>
          </Center>
        </Box>
      )
  }
}

// Hilfsfunktion, um den richtigen Schlüssel für die Kategorie zu erhalten
function getCategoryKey(dataType: string): string {
  switch (dataType) {
    case 'continent':
      return 'continent'
    case 'climate':
      return 'climate'
    case 'batteryType':
      return 'battAlias'
    case 'country':
      return 'country'
    default:
      return 'name'
  }
}
