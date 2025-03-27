import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const FilterPanel = ({ 
  kpiData = [], 
  selectedFilters, 
  onFiltersChange, 
  isLoading = false 
}) => {
  const theme = useTheme();

  // Validate and extract unique values for each filter
  const uniqueValues = React.useMemo(() => {
    if (!kpiData || !Array.isArray(kpiData) || kpiData.length === 0) {
      console.log('No data available for filters');  // Debug log
      return {
        battAlias: [],
        var: [],
        continent: [],
        climate: [],
      };
    }

    try {
      const values = {
        battAlias: [...new Set(kpiData.map(item => item.battAlias).filter(Boolean))].sort(),
        var: [...new Set(kpiData.map(item => item.var).filter(Boolean))].sort(),
        continent: [...new Set(kpiData.map(item => item.continent).filter(Boolean))].sort(),
        climate: [...new Set(kpiData.map(item => item.climate).filter(Boolean))].sort(),
      };
      console.log('Filter options:', values);  // Debug log
      return values;
    } catch (err) {
      console.error('Error processing filter values:', err);
      return {
        battAlias: [],
        var: [],
        continent: [],
        climate: [],
      };
    }
  }, [kpiData]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    console.log('Filter change:', filterType, value);  // Debug log
    onFiltersChange({
      ...selectedFilters,
      [filterType]: value
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel>Battery Alias</InputLabel>
            <Select
              value={selectedFilters.battAlias}
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
              value={selectedFilters.var}
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
              value={selectedFilters.continent}
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
              value={selectedFilters.climate}
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
        </>
      )}
    </Box>
  );
};

FilterPanel.propTypes = {
  kpiData: PropTypes.arrayOf(PropTypes.shape({
    battAlias: PropTypes.string,
    var: PropTypes.string,
    continent: PropTypes.string,
    climate: PropTypes.string,
  })),
  selectedFilters: PropTypes.shape({
    battAlias: PropTypes.string,
    var: PropTypes.string,
    continent: PropTypes.string,
    climate: PropTypes.string,
  }).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default FilterPanel; 