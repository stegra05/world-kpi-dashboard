import React from 'react';
import { KPIData, getCountryData } from '../utils/dataParser';

interface CountryInfoProps {
  data: KPIData[];
  countryCode: string;
  selectedVariable: string;
}

const CountryInfo: React.FC<CountryInfoProps> = ({ data, countryCode, selectedVariable }) => {
  // Get country-specific data
  const countryData = getCountryData(data, countryCode);
  
  // Filter data by selected variable
  const variableData = countryData.filter(item => item.variable === selectedVariable);
  
  // Get country name from the first item
  const countryName = variableData.length > 0 ? variableData[0].country : 'Unknown';
  
  // Calculate total value
  const totalValue = variableData.reduce((sum, item) => sum + item.value, 0);
  
  // Group by model series
  const modelSeriesData: Record<string, number> = {};
  variableData.forEach(item => {
    if (modelSeriesData[item.model_series]) {
      modelSeriesData[item.model_series] += item.value;
    } else {
      modelSeriesData[item.model_series] = item.value;
    }
  });
  
  // Sort model series by value (descending)
  const sortedModelSeries = Object.entries(modelSeriesData).sort((a, b) => b[1] - a[1]);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        {countryName} ({countryCode})
      </h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Variable: {selectedVariable}</h3>
        <p className="text-xl">Total Value: {totalValue.toLocaleString()}</p>
      </div>
      
      {variableData.length > 0 ? (
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
      ) : (
        <p className="text-gray-500">No data available for this country and variable.</p>
      )}
    </div>
  );
};

export default CountryInfo; 