import React from 'react';
import PropTypes from 'prop-types';
import { Box, Chip, Typography, useTheme, useMediaQuery } from '@mui/material';
import {
  BatteryChargingFull as BatteryIcon,
  Functions as FunctionsIcon,
  Public as ContinentIcon,
  Thermostat as ClimateIcon,
  Category as ModelSeriesIcon,
} from '@mui/icons-material';

const FilterChips = ({ selectedFilters }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const filterConfig = [
    {
      key: 'battAlias',
      label: 'Battery',
      icon: <BatteryIcon />,
      value: selectedFilters.battAlias,
    },
    {
      key: 'var',
      label: 'Variable',
      icon: <FunctionsIcon />,
      value: selectedFilters.var,
    },
    {
      key: 'continent',
      label: 'Continent',
      icon: <ContinentIcon />,
      value: selectedFilters.continent,
    },
    {
      key: 'climate',
      label: 'Climate',
      icon: <ClimateIcon />,
      value: selectedFilters.climate,
    },
    {
      key: 'model_series',
      label: 'Model Series',
      icon: <ModelSeriesIcon />,
      value: selectedFilters.model_series,
    },
  ];

  const activeFilters = filterConfig.filter(filter => filter.value);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <Box sx={{ 
      mb: 2,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
      alignItems: 'center',
    }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ 
          mr: 1,
          fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
        }}
      >
        Active Filters:
      </Typography>
      {activeFilters.map(filter => (
        <Chip
          key={filter.key}
          icon={filter.icon}
          label={`${filter.label}: ${filter.value}`}
          size={isSmallScreen ? 'small' : 'medium'}
          sx={{
            '& .MuiChip-icon': {
              fontSize: isSmallScreen ? '1rem' : '1.25rem',
            },
            '& .MuiChip-label': {
              fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
            },
          }}
        />
      ))}
    </Box>
  );
};

FilterChips.propTypes = {
  selectedFilters: PropTypes.shape({
    battAlias: PropTypes.string,
    var: PropTypes.string,
    continent: PropTypes.string,
    climate: PropTypes.string,
    model_series: PropTypes.string,
  }).isRequired,
};

export default FilterChips; 