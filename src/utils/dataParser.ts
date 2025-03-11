export interface KPIData {
  battAlias: string;
  country: string;
  continent: string;
  climate: string;
  iso_a3: string;
  model_series: string;
  variable: string;
  value: number;
  description: string;
  count: number;
}

export function parseData(csvText: string): KPIData[] {
  const lines = csvText.split('\n');
  
  // Debug the header line
  console.log('Header line:', lines[0]);
  const header = lines[0].split(';');
  console.log('Header fields:', header);
  
  const data: KPIData[] = [];
  
  // Skip header line and parse each data line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = line.split(';');
    if (values.length !== header.length) {
      console.warn(`Skipping malformed line ${i}: Expected ${header.length} fields, got ${values.length}`);
      continue; // Skip malformed lines
    }
    
    // Debug log first few parsings
    if (i < 5) {
      console.log(`Parsing line ${i}:`, values);
    }
    
    try {
      // Ensure iso_a3 is uppercase for consistent lookup
      const iso_a3 = values[4] ? values[4].toUpperCase().trim() : '';
      
      data.push({
        battAlias: values[0],
        country: values[1],
        continent: values[2],
        climate: values[3],
        iso_a3: iso_a3,
        model_series: values[5],
        variable: values[6],
        value: parseInt(values[7], 10) || 0, // Default to 0 if parsing fails
        description: values[8],
        count: parseInt(values[9], 10) || 0  // Default to 0 if parsing fails
      });
    } catch (err) {
      console.error(`Error parsing line ${i}:`, err);
    }
  }
  
  // Debug summary
  console.log('Parsed data summary:');
  console.log(`Total data points: ${data.length}`);
  console.log(`Countries: ${new Set(data.map(item => item.country)).size}`);
  console.log(`ISO codes: ${new Set(data.map(item => item.iso_a3)).size}`);
  
  // Log all unique ISO codes for debugging
  const isoCodes = [...new Set(data.map(item => item.iso_a3))].filter(Boolean).sort();
  console.log('All ISO codes:', isoCodes);
  
  console.log(`Variables: ${new Set(data.map(item => item.variable)).size}`);
  
  return data;
}

export function getCountryData(data: KPIData[], countryCode: string): KPIData[] {
  return data.filter(item => item.iso_a3 === countryCode);
}

export function getUniqueVariables(data: KPIData[]): string[] {
  return [...new Set(data.map(item => item.variable))];
}

export function getUniqueBatteryAliases(data: KPIData[]): string[] {
  return [...new Set(data.map(item => item.battAlias))];
}

export function getUniqueContinents(data: KPIData[]): string[] {
  return [...new Set(data.map(item => item.continent).filter(continent => continent))];
}

export function getUniqueClimateTypes(data: KPIData[]): string[] {
  return [...new Set(data.map(item => item.climate).filter(climate => climate))];
}

export function getUniqueModelSeries(data: KPIData[]): string[] {
  return [...new Set(data.map(item => item.model_series).filter(series => series))];
}

export function getFilteredData(
  data: KPIData[], 
  filters: {
    battAlias?: string,
    continent?: string,
    climate?: string,
    model_series?: string,
    variable: string
  }
): KPIData[] {
  return data.filter(item => {
    // Always filter by variable
    if (item.variable !== filters.variable) return false;
    
    // Apply optional filters
    if (filters.battAlias && item.battAlias !== filters.battAlias) return false;
    if (filters.continent && item.continent !== filters.continent) return false;
    if (filters.climate && item.climate !== filters.climate) return false;
    if (filters.model_series && item.model_series !== filters.model_series) return false;
    
    return true;
  });
}

export function getAggregatedDataByCountry(data: KPIData[], variable: string, filters?: {
  battAlias?: string,
  continent?: string,
  climate?: string,
  model_series?: string
}): Record<string, number> {
  const result: Record<string, number> = {};
  
  // Filter data for the selected variable and other filters
  let filteredData = data.filter(item => item.variable === variable);
  
  // Apply optional filters
  if (filters) {
    if (filters.battAlias) {
      filteredData = filteredData.filter(item => item.battAlias === filters.battAlias);
    }
    if (filters.continent) {
      filteredData = filteredData.filter(item => item.continent === filters.continent);
    }
    if (filters.climate) {
      filteredData = filteredData.filter(item => item.climate === filters.climate);
    }
    if (filters.model_series) {
      filteredData = filteredData.filter(item => item.model_series === filters.model_series);
    }
  }
  
  // Debug the filtered data
  console.log(`After filtering for ${variable}, ${filteredData.length} data points remain`);
  if (filteredData.length > 0) {
    console.log('Sample filtered data:', filteredData.slice(0, 3));
  }
  
  // Aggregate by country
  filteredData.forEach(item => {
    // Make sure iso_a3 is uppercase for consistent lookup
    const countryCode = item.iso_a3 ? item.iso_a3.toUpperCase() : '';
    
    if (countryCode) {
      if (result[countryCode]) {
        result[countryCode] += item.value;
      } else {
        result[countryCode] = item.value;
      }
    }
  });
  
  // Debug the result
  console.log(`Aggregated data for ${Object.keys(result).length} countries`);
  
  return result;
}

export function getMinMaxValues(data: Record<string, number>): { min: number, max: number } {
  const values = Object.values(data);
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
} 