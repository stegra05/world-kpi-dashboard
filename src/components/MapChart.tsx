import React, { useState, useEffect, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { scaleQuantile } from 'd3-scale';
import { KPIData, getAggregatedDataByCountry, getMinMaxValues } from '../utils/dataParser';
import { geoSources } from '../config/geoSources';

// World geography data - We'll try multiple sources if needed
const defaultGeoUrl = geoSources[0];

// Color scale for the map
const colorScale = [
  "#eff3ff",
  "#c6dbef",
  "#9ecae1",
  "#6baed6",
  "#4292c6",
  "#2171b5",
  "#084594"
];

interface FilterOptions {
  battAlias?: string | null;
  continent?: string | null;
  climate?: string | null;
  model_series?: string | null;
  variable: string;
}

interface MapChartProps {
  data: KPIData[];
  selectedVariable: string;
  filters: FilterOptions;
  onCountrySelect: (countryCode: string) => void;
}

// Define types for the geographies data
interface GeoFeature {
  rsmKey: string;
  properties: {
    NAME: string;
    ISO_A3: string;
    [key: string]: any;
  }
}

interface GeographiesProps {
  geographies: GeoFeature[];
}

const MapChart: React.FC<MapChartProps> = ({ data, selectedVariable, filters, onCountrySelect }) => {
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipId, setTooltipId] = useState<string>(''); // Track which element is being hovered
  const [mapError, setMapError] = useState<string | null>(null);
  const [geoUrl, setGeoUrl] = useState<string>(defaultGeoUrl);
  const loggedCountriesRef = React.useRef(false);
  const [geoDataLoaded, setGeoDataLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    console.log(`MapChart rendered with ${data.length} data points`);
    console.log(`Selected variable: ${selectedVariable}`);
    console.log('Active filters:', filters);

    // Debug: Check first 5 data items
    if (data.length > 0) {
      console.log('First 5 data items:', data.slice(0, 5));
      
      // Debug: Check if any data has the selected variable
      const matchingVariableData = data.filter(item => item.variable === selectedVariable);
      console.log(`Items matching variable ${selectedVariable}:`, matchingVariableData.length);
      
      if (matchingVariableData.length > 0) {
        console.log('First 5 matching items:', matchingVariableData.slice(0, 5));
      }
    }
  }, [data, selectedVariable, filters]);
  
  // Try to find a working GeoJSON source
  useEffect(() => {
    let currentSourceIndex = 0;
    let mounted = true;
    
    const tryGeoSource = async () => {
      if (!mounted) return;
      
      try {
        const url = geoSources[currentSourceIndex];
        console.log(`Trying geo source ${currentSourceIndex + 1}/${geoSources.length}: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch geo data from ${url}: ${response.status}`);
        }
        
        const geoData = await response.json();
        
        // Verify that the file has the structure we need
        if (!geoData.objects || !geoData.type) {
          throw new Error('Invalid GeoJSON format');
        }
        
        // Check a sample feature
        if (geoData.features && geoData.features.length > 0) {
          const sample = geoData.features[0];
          
          if (!sample.properties || !sample.properties.NAME || !sample.properties.ISO_A3) {
            console.warn('GeoJSON is missing expected properties, but will try to work with it');
          }
          
          console.log('GeoJSON source working:', url);
          console.log('Sample properties:', Object.keys(sample.properties));
        }
        
        if (mounted) {
          setGeoUrl(url);
          setGeoDataLoaded(true);
          console.log('Successfully loaded geo data from:', url);
        }
      } catch (error) {
        console.error('Error loading geo data:', error);
        
        // Try the next source
        currentSourceIndex++;
        
        if (currentSourceIndex < geoSources.length) {
          if (mounted) {
            setTimeout(tryGeoSource, 500); // Try next source after a short delay
          }
        } else {
          if (mounted) {
            console.error('All geo sources failed');
            setMapError('Failed to load map data. Please try again later.');
          }
        }
      }
    };
    
    // Start trying sources
    tryGeoSource();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  // Aggregate data by country for the selected variable and filters
  const countryData = useMemo(() => {
    const aggregatedData = getAggregatedDataByCountry(data, selectedVariable, {
      battAlias: filters.battAlias || undefined,
      continent: filters.continent || undefined,
      climate: filters.climate || undefined,
      model_series: filters.model_series || undefined
    });
    
    // Log some info about the country data
    console.log('Country data:', aggregatedData);
    console.log('Country data countries:', Object.keys(aggregatedData));
    console.log('Country data has entries:', Object.keys(aggregatedData).length > 0);
    
    return aggregatedData;
  }, [data, selectedVariable, filters]);

  // Check if we have any data after filtering
  const hasData = Object.keys(countryData).length > 0;
  
  // Create a color scale based on the data range
  const colorScaleFunction = useMemo(() => {
    try {
      if (!hasData) {
        return () => '#F5F5F5'; // Default color when no data
      }
      
      const { min, max } = getMinMaxValues(countryData);
      console.log(`Data range: min=${min}, max=${max}`);
      
      // Using scaleQuantile for better distribution across non-uniformly distributed data
      return scaleQuantile<string>()
        .domain([min, max])
        .range(colorScale);
    } catch (error) {
      console.error('Error creating color scale:', error);
      setMapError('Error creating color scale');
      return () => '#F5F5F5'; // Default color function
    }
  }, [countryData, hasData]);
  
  const handleMouseEnter = (geo: GeoFeature) => {
    try {
      // Debug the entire geo object to see what properties are actually available
      if (!loggedCountriesRef.current) {
        console.log('Geo object:', geo);
        console.log('Geo properties:', geo.properties);
        
        // Let's check all property names to find ISO code field
        const propNames = Object.keys(geo.properties);
        console.log('All property names:', propNames);
        
        // Try to identify which property might contain the ISO code
        for (const prop of propNames) {
          const value = geo.properties[prop];
          if (typeof value === 'string' && value.length === 3) {
            console.log(`Potential ISO code property: ${prop} = ${value}`);
          }
        }
        
        loggedCountriesRef.current = true;
      }
      
      // The property names might be different from what we expect
      // Try to access name and ISO code regardless of case
      let name = geo.properties.NAME || geo.properties.name;
      let isoCode = geo.properties.ISO_A3 || geo.properties.iso_a3;
      
      // If we still don't have an ISO code, try some common property names
      if (!isoCode) {
        const potentialIsoProps = ['iso', 'id', 'code', 'ISO_A2', 'iso_a2'];
        for (const prop of potentialIsoProps) {
          if (geo.properties[prop] && typeof geo.properties[prop] === 'string') {
            isoCode = geo.properties[prop];
            console.log(`Found ISO code in alternate property: ${prop}`);
            break;
          }
        }
      }
      
      // Use the country name as fallback for identifying countries
      if (!isoCode && name) {
        // Map some common country names to ISO codes
        const nameToIso: Record<string, string> = {
          'United States': 'USA',
          'United States of America': 'USA',
          'United Kingdom': 'GBR',
          'UK': 'GBR',
          'Germany': 'DEU',
          'France': 'FRA',
          'China': 'CHN',
          'Japan': 'JPN',
          'South Korea': 'KOR',
          'Korea, Republic of': 'KOR',
          'Russia': 'RUS',
          'Russian Federation': 'RUS',
          // Add more mappings as needed
        };
        
        isoCode = nameToIso[name] || '';
        if (isoCode) {
          console.log(`Mapped country name "${name}" to ISO code "${isoCode}"`);
        }
      }
      
      // Create a standardized country code for lookup
      const countryCode = isoCode ? isoCode.toUpperCase() : '';
      console.log(`Hovering over: ${name || 'Unknown'} (${countryCode || 'No ISO code'})`);
      
      // Check if we have data for this country
      const hasCountryData = countryCode && countryCode in countryData;
      console.log(`Data for ${countryCode} exists: ${hasCountryData}`);
      
      // Get the value, or 0 if no data
      const value = hasCountryData ? countryData[countryCode] : 0;
      
      // Format the tooltip based on whether we have data
      if (hasCountryData) {
        setTooltipContent(`${name || 'Unknown'}: ${value.toLocaleString()}`);
      } else {
        setTooltipContent(`${name || 'Unknown'}: No data available`);
      }
      
      setTooltipId(geo.rsmKey);
    } catch (error) {
      console.error('Error on mouse enter:', error);
    }
  };
  
  const handleMouseLeave = () => {
    setTooltipContent('');
    setTooltipId('');
  };
  
  const handleCountryClick = (geo: GeoFeature) => {
    try {
      // Get the ISO code, trying different property names for compatibility
      let isoCode = geo.properties.ISO_A3 || geo.properties.iso_a3;
      const countryName = geo.properties.NAME || geo.properties.name || 'Unknown';
      
      // If we still don't have an ISO code, try some common property names
      if (!isoCode) {
        const potentialIsoProps = ['iso', 'id', 'code', 'ISO_A2', 'iso_a2'];
        for (const prop of potentialIsoProps) {
          if (geo.properties[prop] && typeof geo.properties[prop] === 'string') {
            isoCode = geo.properties[prop];
            break;
          }
        }
      }
      
      // Use the country name as fallback for identifying countries
      if (!isoCode && countryName) {
        // Map some common country names to ISO codes
        const nameToIso: Record<string, string> = {
          'United States': 'USA',
          'United States of America': 'USA',
          'United Kingdom': 'GBR',
          'UK': 'GBR',
          'Germany': 'DEU',
          'France': 'FRA',
          'China': 'CHN',
          'Japan': 'JPN',
          'South Korea': 'KOR',
          'Korea, Republic of': 'KOR',
          'Russia': 'RUS',
          'Russian Federation': 'RUS',
          // Add more mappings as needed
        };
        
        isoCode = nameToIso[countryName] || '';
      }
      
      const countryCode = isoCode ? isoCode.toUpperCase() : '';
      
      // Only call onCountrySelect if we have data for this country
      if (countryCode && countryCode in countryData) {
        onCountrySelect(countryCode);
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
      <ReactTooltip 
        id="map-tooltip" 
        place="top"
        render={() => <div>{tooltipContent}</div>}
      />
      {geoDataLoaded ? (
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
              {({ geographies }: GeographiesProps) =>
                geographies.map(geo => {
                  try {
                    // Get the ISO code, trying different property names for compatibility
                    let isoCode = geo.properties.ISO_A3 || geo.properties.iso_a3;
                    let countryName = geo.properties.NAME || geo.properties.name || 'Unknown';
                    
                    // If we still don't have an ISO code, try some common property names
                    if (!isoCode) {
                      const potentialIsoProps = ['iso', 'id', 'code', 'ISO_A2', 'iso_a2'];
                      for (const prop of potentialIsoProps) {
                        if (geo.properties[prop] && typeof geo.properties[prop] === 'string') {
                          isoCode = geo.properties[prop];
                          break;
                        }
                      }
                    }
                    
                    // Use the country name as fallback for identifying countries
                    if (!isoCode && countryName) {
                      // Map some common country names to ISO codes
                      const nameToIso: Record<string, string> = {
                        'United States': 'USA',
                        'United States of America': 'USA',
                        'United Kingdom': 'GBR',
                        'UK': 'GBR',
                        'Germany': 'DEU',
                        'France': 'FRA',
                        'China': 'CHN',
                        'Japan': 'JPN',
                        'South Korea': 'KOR',
                        'Korea, Republic of': 'KOR',
                        'Russia': 'RUS',
                        'Russian Federation': 'RUS',
                        // Add more mappings as needed
                      };
                      
                      isoCode = nameToIso[countryName] || '';
                    }
                    
                    const countryCode = isoCode ? isoCode.toUpperCase() : '';
                    
                    // Debug the first few countries to see if we're getting the right data
                    if (countryCode && !loggedCountriesRef.current) {
                      console.log(`Sample country from map: ${countryName} (${countryCode})`);
                      loggedCountriesRef.current = true;
                    }
                    
                    // Check if we have data for this country
                    const hasData = countryCode && countryCode in countryData;
                    const value = hasData ? countryData[countryCode] : 0;
                    
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
      ) : (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading map data...</p>
          </div>
        </div>
      )}
      
      {/* Filter Summary and Legend */}
      <div className="mt-4 mb-2 text-center text-sm">
        {hasData ? (
          <p className="text-gray-700">
            Showing data for {filters.variable}
            {filters.battAlias ? `, Battery: ${filters.battAlias}` : ''}
            {filters.continent ? `, Continent: ${filters.continent}` : ''}
            {filters.climate ? `, Climate: ${filters.climate}` : ''}
            {filters.model_series ? `, Model: ${filters.model_series}` : ''}
          </p>
        ) : (
          <p className="text-amber-600">No data matches the current filter criteria. Try adjusting your filters.</p>
        )}
      </div>
      
      {/* Legend */}
      {hasData && (
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
      )}
    </div>
  );
};

export default MapChart; 