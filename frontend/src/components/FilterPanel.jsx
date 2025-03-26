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

const FilterPanel = ({ kpiData, onFiltersChange, isLoading }) => {
  const theme = useTheme();
  // State for selected filter values
  const [selectedBattAlias, setSelectedBattAlias] = useState('');
  const [selectedVar, setSelectedVar] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('');
  const [selectedClimate, setSelectedClimate] = useState('');
  const [error, setError] = useState(null);

  // Validate and extract unique values for each filter
  const uniqueValues = React.useMemo(() => {
    if (!kpiData || !Array.isArray(kpiData) || kpiData.length === 0) {
      return {
        battAlias: [],
        var: [],
        continent: [],
        climate: [],
      };
    }

    try {
      return {
        battAlias: [...new Set(kpiData.map(item => item.battAlias).filter(Boolean))].sort(),
        var: [...new Set(kpiData.map(item => item.var).filter(Boolean))].sort(),
        continent: [...new Set(kpiData.map(item => item.continent).filter(Boolean))].sort(),
        climate: [...new Set(kpiData.map(item => item.climate).filter(Boolean))].sort(),
      };
    } catch (err) {
      console.error('Error processing filter values:', err);
      setError('Error processing filter options');
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
    try {
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
    } catch (err) {
      console.error('Error handling filter change:', err);
      setError('Error updating filters');
    }
  };

  // Reset filters when data changes
  useEffect(() => {
    if (!kpiData || !Array.isArray(kpiData) || kpiData.length === 0) {
      setSelectedBattAlias('');
      setSelectedVar('');
      setSelectedContinent('');
      setSelectedClimate('');
      onFiltersChange({
        battAlias: '',
        var: '',
        continent: '',
        climate: '',
      });
    }
  }, [kpiData, onFiltersChange]);

  // Render error state
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            textAlign: 'center',
            backgroundColor: theme.palette.background.default
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Filter Error
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please try refreshing the page or contact support if the problem persists.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Render empty state if no data
  if (!isLoading && (!kpiData || !Array.isArray(kpiData) || kpiData.length === 0)) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          No data available for filtering
        </Alert>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            textAlign: 'center',
            backgroundColor: theme.palette.background.default
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Data Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait for data to load or refresh the page.
          </Typography>
        </Paper>
      </Box>
    );
  }

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
  onFiltersChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

FilterPanel.defaultProps = {
  kpiData: [],
  isLoading: false,
};

export default FilterPanel; 