import React, { useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import { Box, useTheme, useMediaQuery, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const WorldMap = ({ 
  data = [], 
  selectedVar = '', 
  selectedCountryIso = null, 
  onCountryClick = () => {},
  onResetSelection = () => {}
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
    // Check if the click was on a country (point) or on the background
    if (event.points && event.points.length > 0) {
      const points = event.points[0];
      const countryIso = points.location;
      onCountryClick(countryIso);
    } else {
      // Click was on the background, reset selection
      onResetSelection();
    }
  }, [onCountryClick, onResetSelection]);

  // Handle map initialization
  const handleMapInitialized = useCallback(() => {
    setIsMapLoading(false);
    setMapError(null);
  }, []);

  // Handle map errors
  const handleMapError = useCallback((error) => {
    console.error('Map error:', error);
    setMapError('Error initializing map. Please try refreshing the page.');
    setIsMapLoading(false);
  }, []);

  // Prepare map data
  const mapData = useMemo(() => {
    if (!data || data.length === 0) {
      setMapError('No data available for the map');
      return null;
    }

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

      if (locations.length === 0) {
        setMapError('No valid data points available for the map');
        return null;
      }

      return {
        type: 'choropleth',
        locationmode: 'ISO-3',
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
      setMapError('Error processing map data. Please check the data format.');
      return null;
    }
  }, [data, selectedVar, theme.palette.primary.main]);

  // Layout configuration
  const layout = useMemo(() => ({
    geo: {
      showframe: false,
      showcoastlines: true,
      projection: {
        type: 'mercator'
      },
      bgcolor: 'transparent',
      showcountries: true,
      countrycolor: theme.palette.divider,
      coastlinecolor: theme.palette.divider,
      showland: true,
      landcolor: theme.palette.background.paper,
      showlakes: true,
      lakecolor: theme.palette.background.default
    },
    margin: {
      r: 0,
      t: 30,
      b: 0,
      l: 0
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    clickmode: 'event+select',
    height: mapHeight,
    autosize: true
  }), [theme.palette, mapHeight]);

  // Config for Plotly
  const config = useMemo(() => ({
    responsive: true,
    displayModeBar: false,
    scrollZoom: false,
    modeBarButtonsToRemove: ['zoom', 'pan', 'select', 'lasso', 'zoomIn', 'zoomOut', 'autoScale', 'resetScale'],
    modeBarButtonsToAdd: [],
    mapboxAccessToken: null // Disable mapbox
  }), []);

  // Reset error state when data changes
  useEffect(() => {
    setMapError(null);
    setIsMapLoading(true);
  }, [data, selectedVar]);

  // Handle map updates
  useEffect(() => {
    if (mapData) {
      setIsMapLoading(false);
    }
  }, [mapData]);

  if (mapError) {
    return (
      <Box sx={{ 
        p: 2, 
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
        <Typography variant="body1" color="error" gutterBottom>
          {mapError}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please try selecting different filters or refreshing the page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      {isMapLoading && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1,
        }}>
          <CircularProgress />
        </Box>
      )}
      <Plot
        data={[mapData]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        onClick={handleClick}
        onInitialized={handleMapInitialized}
        onError={handleMapError}
        useResizeHandler={true}
      />
    </Box>
  );
};

WorldMap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    iso_a3: PropTypes.string,
    country: PropTypes.string,
    val: PropTypes.number,
    var: PropTypes.string,
  })),
  selectedVar: PropTypes.string,
  selectedCountryIso: PropTypes.string,
  onCountryClick: PropTypes.func,
  onResetSelection: PropTypes.func,
};

WorldMap.defaultProps = {
  data: [],
  selectedVar: '',
  selectedCountryIso: null,
  onCountryClick: () => {},
  onResetSelection: () => {},
};

export default WorldMap; 