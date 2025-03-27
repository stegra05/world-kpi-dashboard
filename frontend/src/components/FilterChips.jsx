import React from 'react';
import PropTypes from 'prop-types';
import { Box, Chip, Stack } from '@mui/material';
import {
  BatteryChargingFull as BatteryIcon,
  Functions as FunctionsIcon,
  Public as ContinentIcon,
  Thermostat as ClimateIcon,
  Category as ModelSeriesIcon,
  LocationOn as CountryIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const FilterChips = ({ selectedFilters, onResetSelection }) => {
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
    {
      key: 'country',
      label: 'Country',
      icon: <CountryIcon />,
      value: selectedFilters.country,
    },
  ];

  const activeFilters = filterConfig.filter(filter => filter.value);

  if (activeFilters.length === 0) {
    return null;
  }

  const handleDelete = (filterKey) => {
    onResetSelection({
      ...selectedFilters,
      [filterKey]: ''
    });
  };

  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      overflow: 'auto',
      maxWidth: '100%',
      '&::-webkit-scrollbar': {
        height: '4px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '2px',
      },
    }}>
      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ 
          py: 0.5,
          flexWrap: 'nowrap',
        }}
      >
        {activeFilters.map(filter => (
          <Chip
            key={filter.key}
            icon={filter.icon}
            label={`${filter.label}: ${filter.value}`}
            size="small"
            onDelete={() => handleDelete(filter.key)}
            deleteIcon={<CloseIcon />}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              '& .MuiChip-icon': {
                color: 'inherit',
              },
              '& .MuiChip-deleteIcon': {
                color: 'inherit',
                '&:hover': {
                  color: 'rgba(255, 0, 0, 0.8)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
              },
            }}
          />
        ))}
      </Stack>
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
    country: PropTypes.string,
  }).isRequired,
  onResetSelection: PropTypes.func.isRequired,
};

export default FilterChips; 