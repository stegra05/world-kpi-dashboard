import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Chip, Typography, Paper, useTheme, Button, Tooltip } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import {
  BatteryChargingFull as BatteryIcon,
  Functions as FunctionsIcon,
  Public as ContinentIcon,
  Thermostat as ClimateIcon,
  Category as ModelSeriesIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const FilterChips = ({ selectedFilters, onFiltersChange, onFilterClear }) => {
  const theme = useTheme();
  
  // Create array of active filters for rendering chips
  const activeFilters = useMemo(() => {
    return Object.entries(selectedFilters)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => ({ key, value }));
  }, [selectedFilters]);
  
  // Handle removing a single filter
  const handleRemoveFilter = (key) => {
    onFiltersChange({
      ...selectedFilters,
      [key]: ''
    });
  };
  
  // Handle clearing all filters
  const handleClearAll = () => {
    if (typeof onFilterClear === 'function') {
      onFilterClear();
    } else {
      // Fallback if onFilterClear not provided
      const resetFilters = Object.keys(selectedFilters).reduce(
        (acc, key) => ({ ...acc, [key]: '' }), {}
      );
      onFiltersChange(resetFilters);
    }
  };
  
  // If no active filters, don't render the component
  if (activeFilters.length === 0) {
    return null;
  }
  
  // Helper to get a friendly display name for the filter type
  const getFilterName = (key) => {
    const displayNames = {
      battAlias: 'Battery',
      var: 'Variable',
      continent: 'Continent',
      climate: 'Climate',
      country: 'Country'
    };
    return displayNames[key] || key;
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 2, 
        p: 1.5, 
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(66, 66, 66, 0.3)' 
          : 'rgba(240, 240, 240, 0.5)',
        borderRadius: 1,
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.12)' 
          : 'rgba(0, 0, 0, 0.08)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mr: 1,
          color: 'primary.main',
          minWidth: 'fit-content'
        }}>
          <FilterAltIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" fontWeight="medium">
            Active Filters:
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1 }}>
          {activeFilters.map(({ key, value }) => (
            <Chip
              key={key}
              label={`${getFilterName(key)}: ${value}`}
              onDelete={() => handleRemoveFilter(key)}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ 
                fontWeight: 500,
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.primary.main,
                  '&:hover': {
                    color: theme.palette.error.main,
                  },
                },
              }}
            />
          ))}
        </Box>
        
        <Tooltip title="Clear all filters">
          <Button 
            size="small"
            color="primary"
            onClick={handleClearAll}
            startIcon={<ClearAllIcon />}
            variant="outlined"
            sx={{ ml: 'auto', minWidth: 'fit-content' }}
          >
            Clear All
          </Button>
        </Tooltip>
      </Box>
    </Paper>
  );
};

FilterChips.propTypes = {
  selectedFilters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  onFilterClear: PropTypes.func,
};

export default FilterChips; 