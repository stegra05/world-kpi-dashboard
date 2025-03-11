'use client'

import { useEffect, useRef, useState } from 'react'
import { Box, Heading, Spinner, Center } from '@chakra-ui/react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { preprocessData } from '@/data/preprocessing'

// Workaround für Leaflet-Icons in Next.js
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
  })
}

interface MapComponentProps {
  title: string
  height?: number | string
}

export function MapComponent({
  title,
  height = 500
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<L.Map | null>(null)
  const geoJsonLayer = useRef<L.GeoJSON | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Leaflet-Icons fixen
    fixLeafletIcon()
    
    // Karte initialisieren, wenn die Komponente gemountet wird
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([20, 0], 2)
      
      // Kachel-Layer hinzufügen (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(leafletMap.current)
      
      // Daten laden und GeoJSON hinzufügen
      loadGeoData()
    }
    
    // Cleanup beim Unmount
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove()
        leafletMap.current = null
      }
    }
  }, [])
  
  // Lade GeoJSON-Daten und verknüpfe sie mit unseren Daten
  const loadGeoData = async () => {
    try {
      setLoading(true)
      
      // Lade die Weltdaten (GeoJSON)
      const worldResponse = await fetch('/geo/countries.geojson')
      const worldData = await worldResponse.json()
      
      // Lade unsere verarbeiteten Daten
      const processedData = await preprocessData()
      const geoData = processedData.geoData
      
      // Erstelle eine Map für schnellen Zugriff auf unsere Daten nach ISO-Code
      const dataByIso: Record<string, any> = {}
      geoData.forEach((item: any) => {
        if (item.iso) {
          dataByIso[item.iso] = item
        }
      })
      
      // Wenn die Karte existiert, füge GeoJSON hinzu
      if (leafletMap.current) {
        // Entferne vorherige Layer, falls vorhanden
        if (geoJsonLayer.current) {
          geoJsonLayer.current.removeFrom(leafletMap.current)
        }
        
        // Erstelle einen neuen GeoJSON-Layer
        geoJsonLayer.current = L.geoJSON(worldData, {
          style: (feature) => {
            const iso = feature?.properties?.ISO_A3
            const countryData = iso ? dataByIso[iso] : null
            
            // Farbe basierend auf Daten oder Standardfarbe
            const fillColor = countryData 
              ? getColorByValue(countryData.value) 
              : '#f7fafc' // neutral light color
            
            return {
              fillColor,
              weight: 1,
              opacity: 1,
              color: '#e2e8f0', // border color
              fillOpacity: 0.7
            }
          },
          onEachFeature: (feature, layer) => {
            const iso = feature?.properties?.ISO_A3
            const countryName = feature?.properties?.NAME || 'Unbekannt'
            const countryData = iso ? dataByIso[iso] : null
            
            // Popup mit Informationen
            if (countryData) {
              layer.bindPopup(`
                <div style="min-width: 200px;">
                  <h3 style="font-weight: bold; margin-bottom: 8px;">${countryName}</h3>
                  <p><strong>Kontinent:</strong> ${countryData.continent || 'Unbekannt'}</p>
                  <p><strong>Klima:</strong> ${countryData.climate || 'Unbekannt'}</p>
                  <p><strong>Wert:</strong> ${countryData.value?.toFixed(2) || 'N/A'}</p>
                  <p><strong>Anzahl Datensätze:</strong> ${countryData.count || 0}</p>
                  <p><strong>Fahrzeuge:</strong> ${countryData.vehicleCount || 0}</p>
                </div>
              `)
            } else {
              layer.bindPopup(`
                <div>
                  <h3 style="font-weight: bold; margin-bottom: 8px;">${countryName}</h3>
                  <p>Keine Daten verfügbar</p>
                </div>
              `)
            }
            
            // Hover-Effekt
            layer.on({
              mouseover: (e) => {
                const l = e.target
                l.setStyle({
                  weight: 2,
                  color: '#3182ce',
                  fillOpacity: 0.9
                })
                l.bringToFront()
              },
              mouseout: (e) => {
                geoJsonLayer.current?.resetStyle(e.target)
              }
            })
          }
        }).addTo(leafletMap.current)
        
        // Passe die Ansicht an die Grenzen des GeoJSON an
        leafletMap.current.fitBounds(geoJsonLayer.current.getBounds())
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Fehler beim Laden der Geodaten:', err)
      setError('Fehler beim Laden der Karte')
      setLoading(false)
    }
  }
  
  // Hilfsfunktion, um Farbe basierend auf Wert zu bestimmen
  const getColorByValue = (value: number): string => {
    // Farbskala von blau (niedrig) bis rot (hoch)
    if (value > 1000) return '#ef4444' // rot
    if (value > 500) return '#f59e0b'  // orange
    if (value > 100) return '#10b981'  // grün
    if (value > 50) return '#3b82f6'   // blau
    return '#8b5cf6'                   // lila
  }

  return (
    <Box>
      <Heading size="md" mb={4}>{title}</Heading>
      
      {loading && (
        <Center h={height} position="relative" zIndex={10}>
          <Spinner size="xl" color="blue.500" />
        </Center>
      )}
      
      {error && (
        <Center h={height}>
          <Heading size="sm" color="red.500">{error}</Heading>
        </Center>
      )}
      
      <Box 
        ref={mapRef} 
        h={height} 
        borderRadius="lg" 
        overflow="hidden"
        border="1px"
        borderColor="gray.200"
        opacity={loading ? 0.3 : 1}
        transition="opacity 0.3s ease"
      />
    </Box>
  )
}
