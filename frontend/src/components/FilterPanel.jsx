import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const FilterPanel = ({ kpiData, onFiltersChange }) => {
  // State for selected filter values
  const [selectedBattAlias, setSelectedBattAlias] = useState('');
  const [selectedVar, setSelectedVar] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('');
  const [selectedClimate, setSelectedClimate] = useState('');

  // Extract unique and sorted values for each filter
  const uniqueValues = {
    battAlias: [...new Set(kpiData.map(item => item.battAlias).filter(Boolean))].sort(),
    var: [...new Set(kpiData.map(item => item.var).filter(Boolean))].sort(),
    continent: [...new Set(kpiData.map(item => item.continent).filter(Boolean))].sort(),
    climate: [...new Set(kpiData.map(item => item.climate).filter(Boolean))].sort(),
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'battAlias':
        setSelectedBattAlias(value);
        break;
      case 'var':
        setSelectedVar(value);
        break;
      case 'continent':
        setSelectedContinent(value);
        break;
      case 'climate':
        setSelectedClimate(value);
        break;
      default:
        break;
    }

    // Notify parent component of filter changes
    onFiltersChange({
      battAlias: filterType === 'battAlias' ? value : selectedBattAlias,
      var: filterType === 'var' ? value : selectedVar,
      continent: filterType === 'continent' ? value : selectedContinent,
      climate: filterType === 'climate' ? value : selectedClimate,
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Battery Alias</InputLabel>
        <Select
          value={selectedBattAlias}
          label="Battery Alias"
          onChange={(e) => handleFilterChange('battAlias', e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {uniqueValues.battAlias.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Variable</InputLabel>
        <Select
          value={selectedVar}
          label="Variable"
          onChange={(e) => handleFilterChange('var', e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {uniqueValues.var.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Continent</InputLabel>
        <Select
          value={selectedContinent}
          label="Continent"
          onChange={(e) => handleFilterChange('continent', e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {uniqueValues.continent.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Climate</InputLabel>
        <Select
          value={selectedClimate}
          label="Climate"
          onChange={(e) => handleFilterChange('climate', e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {uniqueValues.climate.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterPanel; 