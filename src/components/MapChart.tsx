import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import { scaleQuantile } from 'd3-scale';
import { KPIData, getAggregatedDataByCountry, getMinMaxValues } from '../utils/dataParser';

// World geography data - Alternative source if GitHub is not accessible
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Color scale for the map
const colorScale = [
  "#feedde",
  "#fdbe85",
  "#fd8d3c",
  "#e6550d",
  "#a63603",
];

interface MapChartProps {
  data: KPIData[];
  selectedVariable: string;
  onCountrySelect: (countryCode: string) => void;
}

const MapChart: React.FC<MapChartProps> = ({ data, selectedVariable, onCountrySelect }) => {
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [mapError, setMapError] = useState<string | null>(null);
  
  useEffect(() => {
    console.log(`MapChart rendered with ${data.length} data points`);
    console.log(`Selected variable: ${selectedVariable}`);
  }, [data, selectedVariable]);
  
  // Aggregate data by country for the selected variable
  const countryData = getAggregatedDataByCountry(data, selectedVariable);
  
  // Create a color scale based on the data range
  const colorScaleFunction = (() => {
    try {
      const { min, max } = getMinMaxValues(countryData);
      console.log(`Data range: min=${min}, max=${max}`);
      return scaleQuantile<string>()
        .domain([min, max])
        .range(colorScale);
    } catch (error) {
      console.error('Error creating color scale:', error);
      setMapError('Error creating color scale');
      return () => '#F5F5F5'; // Default color function
    }
  })();
  
  const handleMouseEnter = (geo: any) => {
    try {
      const { NAME, ISO_A3 } = geo.properties;
      const value = countryData[ISO_A3] || 0;
      setTooltipContent(`${NAME}: ${value.toLocaleString()}`);
    } catch (error) {
      console.error('Error on mouse enter:', error);
    }
  };
  
  const handleMouseLeave = () => {
    setTooltipContent('');
  };
  
  const handleCountryClick = (geo: any) => {
    try {
      const { ISO_A3 } = geo.properties;
      if (countryData[ISO_A3]) {
        onCountrySelect(ISO_A3);
      }
    } catch (error) {
      console.error('Error on country click:', error);
    }
  };

  if (mapError) {
    return <div className="text-red-500 text-center p-4">{mapError}</div>;
  }

  return (
    <div className="relative">
      <Tooltip id="map-tooltip" />
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 150,
          center: [0, 30]
        }}
        height={500}
        width={900}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                try {
                  const { ISO_A3 } = geo.properties;
                  const value = countryData[ISO_A3] || 0;
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={value ? colorScaleFunction(value) : '#F5F5F5'}
                      stroke="#D6D6DA"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: '#F53' },
                        pressed: { outline: 'none' }
                      }}
                      data-tooltip-id="map-tooltip"
                      onMouseEnter={() => handleMouseEnter(geo)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleCountryClick(geo)}
                      className={value ? 'cursor-pointer' : 'cursor-default'}
                    />
                  );
                } catch (error) {
                  console.error('Error rendering geography:', error);
                  return null;
                }
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Legend */}
      <div className="flex justify-center mt-2">
        <div className="flex items-center">
          <span className="mr-2 text-sm">Low</span>
          {colorScale.map((color, i) => (
            <div
              key={i}
              style={{
                backgroundColor: color,
                width: '20px',
                height: '20px'
              }}
            />
          ))}
          <span className="ml-2 text-sm">High</span>
        </div>
      </div>
    </div>
  );
};

export default MapChart; 