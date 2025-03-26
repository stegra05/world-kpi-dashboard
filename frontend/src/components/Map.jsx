import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Paper } from '@mui/material';

const Map = ({ data, selectedMetric, selectedBattAlias }) => {
  // Transform data for the choropleth map
  const transformedData = data
    .filter(item => item.battAlias === selectedBattAlias && item.var === selectedMetric)
    .map(item => ({
      iso_a3: item.iso_a3,
      value: item.val,
      country: item.country
    }));

  const plotData = [{
    type: 'choropleth',
    locationmode: 'ISO-3',
    locations: transformedData.map(item => item.iso_a3),
    z: transformedData.map(item => item.value),
    text: transformedData.map(item => `${item.country}<br>${selectedMetric}: ${item.value}`),
    colorscale: 'Viridis',
    autocolorscale: false,
    reversescale: false,
    marker: {
      line: {
        color: 'rgb(180,180,180)',
        width: 0.5
      }
    },
    colorbar: {
      title: selectedMetric
    }
  }];

  const layout = {
    title: `${selectedMetric} by Country (${selectedBattAlias})`,
    geo: {
      showframe: false,
      showcoastlines: true,
      projection: {
        type: 'mercator'
      }
    },
    margin: {
      r: 0,
      t: 30,
      b: 0,
      l: 0
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ height: '100%', minHeight: '500px' }}>
        <Plot
          data={plotData}
          layout={layout}
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true }}
        />
      </Box>
    </Paper>
  );
};

export default Map; 