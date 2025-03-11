import React from 'react';
import { KPIData, getCountryData, getFilteredData } from '../utils/dataParser';

interface FilterOptions {
  battAlias?: string | null;
  continent?: string | null;
  climate?: string | null;
  model_series?: string | null;
  variable: string;
}

interface CountryInfoProps {
  data: KPIData[];
  countryCode: string;
  selectedVariable: string;
  filters: FilterOptions;
}

const CountryInfo: React.FC<CountryInfoProps> = ({ data, countryCode, selectedVariable, filters }) => {
  // Get country-specific data
  const countryData = getCountryData(data, countryCode);
  
  // Apply all filters to the country data
  const filteredData = getFilteredData(countryData, {
    battAlias: filters.battAlias || undefined,
    continent: filters.continent || undefined,
    climate: filters.climate || undefined,
    model_series: filters.model_series || undefined,
    variable: selectedVariable
  });
  
  // Get country name from the first item
  const countryName = countryData.length > 0 ? countryData[0].country : 'Unknown';
  
  // Calculate total value of filtered data
  const totalValue = filteredData.reduce((sum, item) => sum + item.value, 0);
  
  // Group by battery alias
  const batteryData: Record<string, number> = {};
  filteredData.forEach(item => {
    if (batteryData[item.battAlias]) {
      batteryData[item.battAlias] += item.value;
    } else {
      batteryData[item.battAlias] = item.value;
    }
  });
  
  // Group by model series
  const modelSeriesData: Record<string, number> = {};
  filteredData.forEach(item => {
    if (modelSeriesData[item.model_series]) {
      modelSeriesData[item.model_series] += item.value;
    } else {
      modelSeriesData[item.model_series] = item.value;
    }
  });
  
  // Group by climate
  const climateData: Record<string, number> = {};
  filteredData.forEach(item => {
    if (item.climate && climateData[item.climate]) {
      climateData[item.climate] += item.value;
    } else if (item.climate) {
      climateData[item.climate] = item.value;
    }
  });
  
  // Sort data by value (descending)
  const sortedBatteryData = Object.entries(batteryData).sort((a, b) => b[1] - a[1]);
  const sortedModelSeries = Object.entries(modelSeriesData).sort((a, b) => b[1] - a[1]);
  const sortedClimateData = Object.entries(climateData).sort((a, b) => b[1] - a[1]);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        {countryName} ({countryCode})
      </h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          {selectedVariable}
          {filters.battAlias ? ` / Battery: ${filters.battAlias}` : ''}
          {filters.continent ? ` / Continent: ${filters.continent}` : ''}
          {filters.climate ? ` / Climate: ${filters.climate}` : ''}
          {filters.model_series ? ` / Model: ${filters.model_series}` : ''}
        </h3>
        <p className="text-xl">Total Value: {totalValue.toLocaleString()}</p>
      </div>
      
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Battery Alias Breakdown */}
          {sortedBatteryData.length > 1 && !filters.battAlias && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Breakdown by Battery</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Battery</th>
                      <th className="py-2 px-4 border-b text-right">Value</th>
                      <th className="py-2 px-4 border-b text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBatteryData.map(([battery, value]) => (
                      <tr key={battery}>
                        <td className="py-2 px-4 border-b">{battery}</td>
                        <td className="py-2 px-4 border-b text-right">{value.toLocaleString()}</td>
                        <td className="py-2 px-4 border-b text-right">
                          {((value / totalValue) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Model Series Breakdown */}
          {sortedModelSeries.length > 1 && !filters.model_series && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Breakdown by Model Series</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Model Series</th>
                      <th className="py-2 px-4 border-b text-right">Value</th>
                      <th className="py-2 px-4 border-b text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedModelSeries.map(([series, value]) => (
                      <tr key={series}>
                        <td className="py-2 px-4 border-b">{series}</td>
                        <td className="py-2 px-4 border-b text-right">{value.toLocaleString()}</td>
                        <td className="py-2 px-4 border-b text-right">
                          {((value / totalValue) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Climate Breakdown */}
          {sortedClimateData.length > 1 && !filters.climate && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Breakdown by Climate</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Climate</th>
                      <th className="py-2 px-4 border-b text-right">Value</th>
                      <th className="py-2 px-4 border-b text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedClimateData.map(([climate, value]) => (
                      <tr key={climate}>
                        <td className="py-2 px-4 border-b">{climate}</td>
                        <td className="py-2 px-4 border-b text-right">{value.toLocaleString()}</td>
                        <td className="py-2 px-4 border-b text-right">
                          {((value / totalValue) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">No data available for this country with the current filters.</p>
      )}
    </div>
  );
};

export default CountryInfo; 