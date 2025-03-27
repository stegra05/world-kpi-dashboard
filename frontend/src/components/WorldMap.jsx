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
                      `${selectedVar ? selectedVar : 'Value'}: %{z:.2f}<br>` +
                      '<extra></extra>',
        colorscale: 'Viridis',
        showscale: true,
        colorbar: {
          title: selectedVar || 'Value',
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
          titlefont: {
            size: 12,
            color: theme.palette.mode === 'dark' ? '#fff' : '#000'
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
      };
    } catch (error) {
      console.error('Error preparing map data:', error);
      setMapError('Error preparing map data');
      return null;
    }
  }, [data, selectedVar, theme.palette.mode, selectedCountryIso, theme.palette.primary.main]);

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
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      position: 'relative',
      borderRadius: 1,
      overflow: 'hidden'
    }}>
      {isMapLoading && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 2,
        }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Only render the Plot component if mapData is not null */}
      {mapData ? (
        <Plot
          data={[mapData]}
          layout={layout}
          config={config}
          style={{
            width: '100%',
            height: mapHeight,
          }}
          onClick={handleClick}
          onInitialized={handleMapInitialized}
          onError={handleMapError}
          useResizeHandler={true}
        />
      ) : (
        <Box sx={{ 
          p: 2, 
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {mapError || 'No data available for the selected filters'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

WorldMap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    iso_a3: PropTypes.string,
    country: PropTypes.string,
    val: PropTypes.number,
  })),
  selectedVar: PropTypes.string,
  selectedCountryIso: PropTypes.string,
  onCountryClick: PropTypes.func,
  onResetSelection: PropTypes.func,
};

export default WorldMap; 