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
        colorscale: 'Viridis',
        showscale: true,
        colorbar: {
          title: selectedVar,
          thickness: 15,
          len: 0.5,
          y: 0.5,
          yanchor: 'middle',
          outlinewidth: 0,
        },
        marker: {
          line: {
            color: theme.palette.mode === 'dark' ? '#666' : '#999',
            width: 0.5,
          },
        },
      };
    } catch (error) {
      console.error('Error preparing map data:', error);
      setMapError('Error preparing map data');
      return null;
    }
  }, [data, selectedVar, theme.palette.mode]);

  // Map layout configuration
  const layout = useMemo(() => ({
    geo: {
      showframe: false,
      showcoastlines: true,
      projection: {
        type: 'mercator',
        scale: 1.2,
      },
      fitbounds: 'locations',
      center: { lat: 20, lon: 0 },
      zoom: 1.2,
    },
    margin: { t: 0, b: 0, l: 0, r: 0 },
    autosize: true,
    dragmode: 'zoom',
    showlegend: false,
    modebar: {
      orientation: 'v',
      position: 'top-right',
      bgcolor: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
    modebarRemove: ['autoScale2d'],
    modebarAdd: ['zoom', 'pan', 'resetScale2d'],
  }), [theme.palette.mode]);

  // Map configuration
  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    scrollZoom: true,
    modeBarButtonsToAdd: ['zoom', 'pan', 'resetScale2d'],
    modeBarButtonsToRemove: ['autoScale2d'],
  };

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
    <Box sx={{ width: '100%', height: '100%' }}>
      <Plot
        data={[mapData]}
        layout={layout}
        config={config}
        onClick={handleClick}
        onInitialized={handleMapInitialized}
        onError={handleMapError}
        style={{ width: '100%', height: '100%' }}
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