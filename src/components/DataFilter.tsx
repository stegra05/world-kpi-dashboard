import React from 'react';

interface DataFilterProps {
  selectedVariable: string;
  onVariableChange: (variable: string) => void;
}

const DataFilter: React.FC<DataFilterProps> = ({ selectedVariable, onVariableChange }) => {
  // We know from the data there are at least variable_1 and variable_2
  const variables = ['variable_1', 'variable_2'];
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-center">
        <label htmlFor="variable-select" className="mr-4 font-medium">
          Select Variable:
        </label>
        <select
          id="variable-select"
          value={selectedVariable}
          onChange={(e) => onVariableChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {variables.map((variable) => (
            <option key={variable} value={variable}>
              {variable}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Select a variable to display data on the map. Countries are colored based on their total values.</p>
        <p>Click on a country to view detailed information.</p>
      </div>
    </div>
  );
};

export default DataFilter; 