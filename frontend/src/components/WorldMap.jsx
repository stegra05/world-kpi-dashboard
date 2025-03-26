import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const WorldMap = ({ data, selectedMetric, selectedBattAlias, onCountryClick }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate responsive height based on screen size
  const mapHeight = isSmallScreen ? 300 : isMediumScreen ? 400 : 500;

  // Memoize the click handler
  const handleClick = useCallback((event) => {
    if (event.points && event.points[0]) {
      const location = event.points[0].location;
      onCountryClick(location);
    }
  }, [onCountryClick]);

  // Prepare data for the choropleth map with performance optimizations
  const mapData = useMemo(() => {
    if (!data || !selectedMetric || !selectedBattAlias) return [];

    // Filter data for selected metric and battery alias
    const filteredData = data.filter(
      item => item.var === selectedMetric && item.battAlias === selectedBattAlias
    );

    // Group by country and calculate average value
    const countryData = filteredData.reduce((acc, item) => {
      if (!acc[item.iso_a3]) {
        acc[item.iso_a3] = {
          value: 0,
          count: 0,
          country: item.country
        };
      }
      acc[item.iso_a3].value += item.val;
      acc[item.iso_a3].count += 1;
      return acc;
    }, {});

    // Calculate averages and prepare arrays for the map
    const locations = [];
    const values = [];
    const text = [];
    const hoverText = [];

    Object.entries(countryData).forEach(([iso, data]) => {
      locations.push(iso);
      const avgValue = data.value / data.count;
      values.push(avgValue);
      text.push(avgValue.toLocaleString(undefined, { maximumFractionDigits: 2 }));
      hoverText.push(
        `<b>${data.country}</b><br>` +
        `${selectedMetric}: ${avgValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}<br>` +
        `Battery: ${selectedBattAlias}<br>` +
        `Data points: ${data.count}`
      );
    });

    return [{
      type: 'choropleth',
      locationmode: 'ISO-3',
      locations: locations,
      z: values,
      text: text,
      hovertext: hoverText,
      hovertemplate: '%{hovertext}<extra></extra>',
      colorscale: [
        [0, '#313695'],
        [0.2, '#4575b4'],
        [0.4, '#74add1'],
        [0.6, '#abd9e9'],
        [0.8, '#fdae61'],
        [1, '#d73027']
      ],
      colorbar: {
        title: {
          text: selectedMetric,
          font: {
            color: theme.palette.text.primary,
            size: isSmallScreen ? 12 : 14
          }
        },
        tickfont: {
          color: theme.palette.text.secondary,
          size: isSmallScreen ? 10 : 12
        },
        thickness: isSmallScreen ? 10 : 15,
        len: isSmallScreen ? 0.4 : 0.5,
        y: 0.5,
        yanchor: 'middle',
        outlinewidth: 0,
        outlinecolor: theme.palette.divider,
        bgcolor: theme.palette.background.paper,
        borderwidth: 0,
        x: 1.02,
        xanchor: 'left'
      },
      marker: {
        line: {
          color: theme.palette.divider,
          width: isSmallScreen ? 0.3 : 0.5
        }
      },
      hoverlabel: {
        bgcolor: theme.palette.background.paper,
        font: { 
          color: theme.palette.text.primary,
          size: isSmallScreen ? 12 : 14
        },
        bordercolor: theme.palette.divider,
        borderwidth: 1
      }
    }];
  }, [data, selectedMetric, selectedBattAlias, theme, isSmallScreen]);

  const layout = useMemo(() => ({
    geo: {
      showframe: false,
      showcoastlines: true,
      coastlinecolor: theme.palette.divider,
      projection: {
        type: 'natural earth',
        scale: isSmallScreen ? 1.1 : 1.2
      },
      bgcolor: 'transparent',
      subunitwidth: isSmallScreen ? 0.3 : 0.5,
      subunitcolor: theme.palette.divider,
      countrywidth: isSmallScreen ? 0.3 : 0.5,
      countrycolor: theme.palette.divider,
      lakecolor: theme.palette.background.paper,
      landcolor: theme.palette.background.paper
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { 
      t: 0, 
      b: 0, 
      l: 0, 
      r: isSmallScreen ? 20 : 30 
    },
    showlegend: false,
    height: mapHeight,
    clickmode: 'event+select',
    hovermode: 'closest',
    hoverdistance: isSmallScreen ? 50 : 100,
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    }
  }), [theme, isSmallScreen, mapHeight]);

  const config = useMemo(() => ({
    responsive: true,
    displayModeBar: false,
    scrollZoom: false,
    doubleClick: 'reset+autosize',
    toImageButtonOptions: {
      format: 'png',
      filename: 'world_kpi_map',
      height: mapHeight,
      width: null,
      scale: 2
    }
  }), [mapHeight]);

  return (
    <Box sx={{ 
      width: '100%', 
      height: mapHeight,
      backgroundColor: theme.palette.background.paper,
      borderRadius: 2,
      boxShadow: theme.shadows[2],
      overflow: 'hidden',
      position: 'relative',
      transition: 'all 0.3s ease-in-out'
    }}>
      <Plot
        data={mapData}
        layout={layout}
        config={config}
        onClick={handleClick}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        onInitialized={() => {
          // Trigger a resize event to ensure proper rendering
          window.dispatchEvent(new Event('resize'));
        }}
      />
    </Box>
  );
};

WorldMap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    iso_a3: PropTypes.string,
    country: PropTypes.string,
    battAlias: PropTypes.string,
    var: PropTypes.string,
    val: PropTypes.number,
  })).isRequired,
  selectedMetric: PropTypes.string,
  selectedBattAlias: PropTypes.string,
  onCountryClick: PropTypes.func.isRequired,
};

export default WorldMap; 