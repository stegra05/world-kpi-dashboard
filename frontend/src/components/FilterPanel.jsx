import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

const FilterPanel = ({ 
  selectedFilters, 
  onFiltersChange,
  kpiData = [] // Add kpiData as a prop
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    battAlias: [],
    var: [],
    continent: [],
    climate: [],
  });
  const [error, setError] = useState(null);

  // Extract filter options directly from kpiData
  const extractFilterOptions = useCallback(() => {
    try {
      setLoading(true);
      
      if (!kpiData || !Array.isArray(kpiData) || kpiData.length === 0) {
        setError('No data available to extract filter options');
        return;
      }

      // Extract unique values for each filter type
      const options = {
        battAlias: [...new Set(kpiData.map(item => item.battAlias).filter(Boolean))],
        var: [...new Set(kpiData.map(item => item.var).filter(Boolean))],
        continent: [...new Set(kpiData.map(item => item.continent).filter(Boolean))],
        climate: [...new Set(kpiData.map(item => item.climate).filter(Boolean))],
      };

      // Sort the options
      Object.keys(options).forEach(key => {
        options[key].sort();
      });

      setFilterOptions(options);
      setError(null);
    } catch (err) {
      console.error('Error extracting filter options:', err);
      setError('Failed to extract filter options');
    } finally {
      setLoading(false);
    }
  }, [kpiData]);

  // Extract filter options when kpiData changes
  useEffect(() => {
    extractFilterOptions();
  }, [extractFilterOptions]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...selectedFilters,
      [filterType]: value
    });
  };

  // Reset all filters
  const handleResetAllFilters = () => {
    onFiltersChange({
      battAlias: '',
      var: '',
      continent: '',
      climate: '',
      country: '',
    });
  };

  // Count active filters
  const activeFilterCount = Object.values(selectedFilters).filter(Boolean).length;

  const renderFilterSelect = (id, label, options) => (
    <FormControl 
      fullWidth 
      margin="dense" 
      variant="outlined"
      size="small"
      sx={{ 
        mb: 2,
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem',
        },
        '& .MuiSelect-select': {
          padding: '8px 14px',
        }
      }}
    >
      <InputLabel id={`${id}-label`} shrink={!!selectedFilters[id]}>
        {label}
      </InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        value={selectedFilters[id] || ''}
        label={label}
        onChange={(e) => handleFilterChange(id, e.target.value)}
        displayEmpty
        notched
        endAdornment={
          selectedFilters[id] ? (
            <Tooltip title={`Clear ${label} filter`}>
              <IconButton 
                size="small" 
                sx={{ marginRight: 1.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFilterChange(id, '');
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null
        }
      >
        <MenuItem value="">
          <em>All {label}s</em>
        </MenuItem>
        {options.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" icon={<ErrorOutlineIcon />}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            {activeFilterCount > 0 ? (
              <Chip 
                icon={<FilterAltIcon />} 
                label={`${activeFilterCount} active`}
                size="small"
                color="primary"
                variant="outlined"
              />
            ) : (
              <Typography variant="caption" color="text.secondary">
                No filters active
              </Typography>
            )}
            
            {activeFilterCount > 0 && (
              <Tooltip title="Reset all filters">
                <IconButton 
                  size="small" 
                  onClick={handleResetAllFilters}
                  color="primary"
                >
                  <FilterAltOffIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          {renderFilterSelect('battAlias', 'Battery', filterOptions.battAlias)}
          {renderFilterSelect('var', 'Variable', filterOptions.var)}
          {renderFilterSelect('continent', 'Continent', filterOptions.continent)}
          {renderFilterSelect('climate', 'Climate', filterOptions.climate)}
          
          {selectedFilters.country && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Selected Country:
                </Typography>
                <Chip 
                  label={selectedFilters.country}
                  size="small"
                  onDelete={() => handleFilterChange('country', '')}
                  sx={{ fontSize: '0.8rem' }}
                />
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

FilterPanel.propTypes = {
  selectedFilters: PropTypes.shape({
    battAlias: PropTypes.string,
    var: PropTypes.string,
    continent: PropTypes.string,
    climate: PropTypes.string,
    country: PropTypes.string,
  }).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  kpiData: PropTypes.array, // Add prop type for kpiData
};

export default FilterPanel; 