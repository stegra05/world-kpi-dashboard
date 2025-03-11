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
  const header = lines[0].split(';');
  
  const data: KPIData[] = [];
  
  // Skip header line and parse each data line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = line.split(';');
    if (values.length !== header.length) continue; // Skip malformed lines
    
    data.push({
      battAlias: values[0],
      country: values[1],
      continent: values[2],
      climate: values[3],
      iso_a3: values[4],
      model_series: values[5],
      variable: values[6],
      value: parseInt(values[7], 10),
      description: values[8],
      count: parseInt(values[9], 10)
    });
  }
  
  return data;
}

export function getCountryData(data: KPIData[], countryCode: string): KPIData[] {
  return data.filter(item => item.iso_a3 === countryCode);
}

export function getUniqueVariables(data: KPIData[]): string[] {
  return [...new Set(data.map(item => item.variable))];
}

export function getAggregatedDataByCountry(data: KPIData[], variable: string): Record<string, number> {
  const result: Record<string, number> = {};
  
  // Filter data for the selected variable and aggregate by country
  const filteredData = data.filter(item => item.variable === variable);
  
  filteredData.forEach(item => {
    if (item.iso_a3) {
      if (result[item.iso_a3]) {
        result[item.iso_a3] += item.value;
      } else {
        result[item.iso_a3] = item.value;
      }
    }
  });
  
  return result;
}

export function getMinMaxValues(data: Record<string, number>): { min: number, max: number } {
  const values = Object.values(data);
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
} 