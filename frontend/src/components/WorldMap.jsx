import React, { useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import { Box, useTheme, useMediaQuery, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const WorldMap = ({ 
  data = [], 
  selectedVar = '', 
  selectedCountryIso = null, 
  onCountryClick = () => {} 
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  // Calculate responsive height based on screen size
  const mapHeight = isSmallScreen ? 300 : isMediumScreen ? 400 : 500;

  // Memoize the click handler
  const handleClick = useCallback((event) => {
    const points = event.points[0];
    const countryIso = points.location;
    onCountryClick(countryIso);
  }, [onCountryClick]);

  // Handle map initialization
  const handleMapInitialized = useCallback(() => {
    setIsMapLoading(false);
    window.dispatchEvent(new Event('resize'));
  }, []);

  // Handle map errors
  const handleMapError = useCallback((error) => {
    console.error('Map error:', error);
    setMapError('Error initializing map');
    setIsMapLoading(false);
  }, []);

  // Prepare map data
  const mapData = useMemo(() => {
    if (!data || data.length === 0) return null;

    try {
      // Group data by country and calculate average values
      const groupedData = data.reduce((acc, item) => {
        if (!acc[item.iso_a3]) {
          acc[item.iso_a3] = {
            sum: Number(item.val) || 0,
            count: 1,
            country: item.country
          };
        } else {
          acc[item.iso_a3].sum += Number(item.val) || 0;
          acc[item.iso_a3].count += 1;
        }
        return acc;
      }, {});

      // Calculate averages and prepare data for the map
      const locations = [];
      const values = [];
      const text = [];
      const customdata = [];

      Object.entries(groupedData).forEach(([iso, data]) => {
        locations.push(iso);
        const avgValue = data.sum / data.count;
        values.push(avgValue);
        text.push(`${data.country}<br>Average ${selectedVar}: ${avgValue.toFixed(2)}`);
        customdata.push(data.country);
      });

      return {
        type: 'choropleth',
        locations,
        z: values,
        text,
        customdata,
        hovertemplate: '<b>%{customdata}</b><br>' +
                      `${selectedVar}: %{z:.2f}<br>` +
                      '<extra></extra>',
        hoverinfo: 'text',
        colorscale: 'Blues',
        colorbar: {
          title: selectedVar,
          thickness: 20,
          len: 0.5,
          y: 0.5,
          tickformat: '.1f'
        },
        zmin: Math.min(...values),
        zmax: Math.max(...values),
        showscale: true,
        selected: {
          marker: {
            opacity: 1,
            line: {
              color: theme.palette.primary.main,
              width: 2
            }
          }
        },
        unselected: {
          marker: { opacity: 0.5 }
        }
      };
    } catch (err) {
      console.error('Error processing map data:', err);
      setMapError('Error processing map data');
      return null;
    }
  }, [data, selectedVar, theme.palette.primary.main]);

  // Layout configuration
  const layout = useMemo(() => ({
    geo: {
      showframe: false,
      showcoastlines: true,
      projection: { 
        type: 'equirectangular',
        scale: 1.1
      },
      bgcolor: 'transparent',
      showcountries: true,
      countrycolor: theme.palette.divider,
      coastlinecolor: theme.palette.divider,
      showland: true,
      landcolor: theme.palette.background.paper,
      showlakes: true,
      lakecolor: theme.palette.background.default,
      lataxis: {
        range: [-60, 90], // Exclude Antarctica (south of -60°)
        showgrid: false,
        zeroline: false
      },
      lonaxis: {
        showgrid: false,
        zeroline: false
      }
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { t: 0, l: 0, r: 0, b: 0 },
    height: isSmallScreen ? 300 : 500,
    autosize: true,
    dragmode: 'zoom',
    showlegend: false,
  }), [isSmallScreen, theme.palette]);

  // Config for the plot
  const config = useMemo(() => ({
    displayModeBar: true,
    responsive: true,
    scrollZoom: true,
    modeBarButtonsToAdd: ['zoom', 'pan', 'resetScale2d'],
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  }), []);

  useEffect(() => {
    setIsMapLoading(false);
  }, [data]);

  if (mapError) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
        <Alert severity="error" sx={{ mb: 2 }}>
          {mapError}
        </Alert>
      </Box>
    );
  }

  if (!mapData) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {selectedVar ? 'No data available for the selected filters' : 'Please select a variable to display'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      height: isSmallScreen ? 300 : 500,
      bgcolor: 'background.paper',
      borderRadius: 1,
      overflow: 'hidden',
      boxShadow: 1,
      p: 2
    }}>
      {mapError ? (
        <Alert severity="error" sx={{ m: 2 }}>
          {mapError}
        </Alert>
      ) : isMapLoading ? (
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <CircularProgress />
        </Box>
      ) : (
        <Plot
          data={[mapData]}
          layout={layout}
          config={config}
          onClick={handleClick}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </Box>
  );
};

WorldMap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    iso_a3: PropTypes.string,
    country: PropTypes.string,
    val: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    cnt_vhcl: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })),
  selectedVar: PropTypes.string,
  selectedCountryIso: PropTypes.string,
  onCountryClick: PropTypes.func.isRequired,
};

export default WorldMap; 