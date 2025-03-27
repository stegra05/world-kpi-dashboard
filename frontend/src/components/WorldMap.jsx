import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import { Box, useTheme, useMediaQuery, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const WorldMap = ({ 
  data = [], 
  selectedCountryIso = null, 
  onCountryClick = () => {},
  onResetSelection = () => {},
  isLoading = false
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const plotRef = useRef(null);

  // Calculate responsive height based on screen size - increased heights
  const mapHeight = isSmallScreen ? 400 : isMediumScreen ? 500 : 600;

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
    console.log('Map initialized successfully');
    setIsMapLoading(false);
    setMapError(null);
  }, []);

  // Handle map errors
  const handleMapError = useCallback((error) => {
    console.error('Map error:', error);
    setMapError('Error initializing map. Please try refreshing the page.');
    setIsMapLoading(false);
  }, []);

  // Reset loading state when external loading flag changes
  useEffect(() => {
    if (isLoading) {
      setIsMapLoading(true);
    }
  }, [isLoading]);

  // Force redraw on theme change
  useEffect(() => {
    if (plotRef.current && plotRef.current.resizeHandler) {
      setTimeout(() => {
        plotRef.current.resizeHandler();
      }, 100);
    }
  }, [theme.palette.mode]);

  // Prepare map data
  const mapData = useMemo(() => {
    if (!data || data.length === 0) {
      if (!isLoading) {
        console.error('No data available for the map');
        setMapError('No data available for the map');
      }
      return null;
    }

    try {
      // Log data for debugging
      console.log(`Processing ${data.length} data points for map`);
      console.log('Sample data point:', data[0]);
      
      // Find the metric name from the first data item
      const selectedVar = data[0]?.var || 'Value';
      
      // Group data by country and calculate average values
      const groupedData = data.reduce((acc, item) => {
        if (!item.iso_a3) {
          console.warn('Item missing iso_a3:', item);
          return acc;
        }
        
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

      console.log(`Grouped data for ${Object.keys(groupedData).length} countries`);
      
      // Calculate averages and prepare data for the map
      const locations = [];
      const values = [];
      const customdata = [];

      Object.entries(groupedData).forEach(([iso, data]) => {
        locations.push(iso);
        const avgValue = data.sum / data.count;
        values.push(avgValue);
        customdata.push({
          country: data.country,
          metricValue: avgValue.toFixed(2)
        });
      });

      if (locations.length === 0) {
        console.error('No valid location data for the map');
        setMapError('No valid data points available for the map');
        return null;
      }

      console.log(`Prepared map data with ${locations.length} locations`);

      // Color scale with special color for missing data values
      // Viridis is a perceptually uniform, sequential colorscale
      const colorscale = 'Viridis';

      return {
        type: 'choropleth',
        locationmode: 'ISO-3',
        locations,
        z: values,
        customdata,
        hovertemplate: 
          '<b>%{customdata.country}</b><br>' +
          `${selectedVar}: %{customdata.metricValue}<br>` +
          '<extra></extra>',
        colorscale,
        showscale: true,
        colorbar: {
          title: {
            text: selectedVar || 'Value',
            font: {
              size: 12,
              color: theme.palette.mode === 'dark' ? '#fff' : '#000'
            }
          },
          thickness: 20,
          len: 0.6,
          y: 0.5,
          yanchor: 'middle',
          outlinewidth: 1,
          outlinecolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          tickfont: {
            size: 10,
            color: theme.palette.mode === 'dark' ? '#eee' : '#333'
          },
        },
        marker: {
          line: {
            color: theme.palette.mode === 'dark' ? '#555' : '#ddd',
            width: 0.5,
          },
          opacity: 0.9,
        },
        selectedpoints: selectedCountryIso ? [locations.indexOf(selectedCountryIso)] : [],
        selected: {
          marker: {
            opacity: 1,
            line: {
              color: theme.palette.primary.main,
              width: 2,
            },
          }
        },
        // Handle missing data - countries not in our dataset will remain uncolored/blank
        // This is the default behavior for choropleth maps
        zauto: true,  // Auto-scale the color range based on data values
      };
    } catch (error) {
      console.error('Error preparing map data:', error);
      setMapError('Error preparing map data');
      return null;
    }
  }, [data, selectedCountryIso, theme.palette.mode, theme.palette.primary.main, isLoading]);

  // Map layout configuration
  const layout = useMemo(() => ({
    geo: {
      showframe: false,
      showcoastlines: true,
      coastlinecolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
      showocean: true,
      oceancolor: theme.palette.mode === 'dark' ? '#181818' : '#f8f8f8',
      showlakes: true,
      lakecolor: theme.palette.mode === 'dark' ? '#181818' : '#f8f8f8',
      showrivers: false,
      projection: {
        type: 'mercator',
        scale: 1.1,
      },
      lonaxis: {
        showgrid: true,
        gridwidth: 0.5,
        gridcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      },
      lataxis: {
        showgrid: true,
        gridwidth: 0.5,
        gridcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      },
    },
    margin: { t: 5, b: 5, l: 5, r: 5 },
    autosize: true,
    dragmode: 'zoom',
    showlegend: false,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    hoverlayer: {
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
      bordercolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
      font: {
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      },
    },
    modebar: {
      orientation: 'h',
      bgcolor: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      activecolor: theme.palette.primary.main,
    },
  }), [theme.palette.mode, theme.palette.primary.main]);

  // Map configuration
  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    scrollZoom: true,
    modeBarButtonsToAdd: ['zoomIn', 'zoomOut', 'resetGeo'],
    modeBarButtonsToRemove: ['autoScale2d', 'lasso2d', 'select2d', 'toggleSpikelines'],
  };

  return (
    <Box sx={{ position: 'relative', height: mapHeight, width: '100%' }}>
      {(isLoading || isMapLoading) && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(2px)',
          zIndex: 2,
        }}>
          <CircularProgress />
        </Box>
      )}
      
      {mapError && !isLoading && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          width: '80%',
          maxWidth: 500,
        }}>
          <Alert 
            severity="error" 
            variant="outlined"
            icon={<ErrorOutlineIcon />}
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.9)',
              boxShadow: 3,
            }}
          >
            {mapError}
          </Alert>
        </Box>
      )}
      
      {mapData && (
        <Plot
          ref={plotRef}
          data={[mapData]}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          onInitialized={handleMapInitialized}
          onClick={handleClick}
          onError={handleMapError}
          useResizeHandler={true}
        />
      )}
    </Box>
  );
};

WorldMap.propTypes = {
  data: PropTypes.array,
  selectedCountryIso: PropTypes.string,
  onCountryClick: PropTypes.func,
  onResetSelection: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default WorldMap; 