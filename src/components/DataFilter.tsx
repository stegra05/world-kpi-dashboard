import React from 'react';

interface DataFilterProps {
  selectedVariable: string;
  onVariableChange: (variable: string) => void;
  variables: string[];
  batteryAliases: string[];
  continents: string[];
  climateTypes: string[];
  modelSeries: string[];
  selectedBattery: string | null;
  selectedContinent: string | null;
  selectedClimate: string | null;
  selectedModelSeries: string | null;
  onBatteryChange: (battery: string | null) => void;
  onContinentChange: (continent: string | null) => void;
  onClimateChange: (climate: string | null) => void;
  onModelSeriesChange: (modelSeries: string | null) => void;
}

const DataFilter: React.FC<DataFilterProps> = ({
  selectedVariable,
  onVariableChange,
  variables,
  batteryAliases,
  continents,
  climateTypes,
  modelSeries,
  selectedBattery,
  selectedContinent,
  selectedClimate,
  selectedModelSeries,
  onBatteryChange,
  onContinentChange,
  onClimateChange,
  onModelSeriesChange
}) => {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        {/* Variable Filter */}
        <div>
          <label htmlFor="variable-select" className="block mb-2 text-sm font-medium">
            Variable:
          </label>
          <select
            id="variable-select"
            value={selectedVariable}
            onChange={(e) => onVariableChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {variables.map((variable) => (
              <option key={variable} value={variable}>
                {variable}
              </option>
            ))}
          </select>
        </div>

        {/* Battery Filter */}
        <div>
          <label htmlFor="battery-select" className="block mb-2 text-sm font-medium">
            Battery Type:
          </label>
          <select
            id="battery-select"
            value={selectedBattery || ''}
            onChange={(e) => onBatteryChange(e.target.value === '' ? null : e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Batteries</option>
            {batteryAliases.map((battery) => (
              <option key={battery} value={battery}>
                {battery}
              </option>
            ))}
          </select>
        </div>

        {/* Continent Filter */}
        <div>
          <label htmlFor="continent-select" className="block mb-2 text-sm font-medium">
            Continent:
          </label>
          <select
            id="continent-select"
            value={selectedContinent || ''}
            onChange={(e) => onContinentChange(e.target.value === '' ? null : e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Continents</option>
            {continents.map((continent) => (
              <option key={continent} value={continent}>
                {continent}
              </option>
            ))}
          </select>
        </div>

        {/* Climate Filter */}
        <div>
          <label htmlFor="climate-select" className="block mb-2 text-sm font-medium">
            Climate:
          </label>
          <select
            id="climate-select"
            value={selectedClimate || ''}
            onChange={(e) => onClimateChange(e.target.value === '' ? null : e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Climates</option>
            {climateTypes.map((climate) => (
              <option key={climate} value={climate}>
                {climate}
              </option>
            ))}
          </select>
        </div>

        {/* Model Series Filter */}
        <div>
          <label htmlFor="modelseries-select" className="block mb-2 text-sm font-medium">
            Model Series:
          </label>
          <select
            id="modelseries-select"
            value={selectedModelSeries || ''}
            onChange={(e) => onModelSeriesChange(e.target.value === '' ? null : e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Models</option>
            {modelSeries.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="bg-gray-100 p-3 rounded text-center text-sm text-gray-600">
        <p>Filter the data by different criteria. The map shows countries colored based on their total values for the selected filters.</p>
        <p>Click on a country to view detailed information.</p>
      </div>
    </div>
  );
};

export default DataFilter; 