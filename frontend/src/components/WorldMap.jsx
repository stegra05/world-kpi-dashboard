import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';

const WorldMap = ({ filteredData, selectedVar }) => {
  // Prepare data for the choropleth map
  const traceData = useMemo(() => {
    // Filter out entries with missing data
    const validData = filteredData.filter(item => 
      item.iso_a3 && 
      item.val !== null && 
      item.val !== undefined && 
      item.country
    );

    return {
      type: 'choropleth',
      locations: validData.map(item => item.iso_a3),
      z: validData.map(item => item.val),
      text: validData.map(item => item.country),
      colorscale: 'Viridis',
      colorbar: {
        title: selectedVar || 'Value',
        titleside: 'right',
      },
      marker: {
        line: {
          color: 'rgb(180,180,180)',
          width: 0.5
        }
      },
      hovertemplate: 
        '<b>%{text}</b><br>' +
        `${selectedVar || 'Value'}: %{z}<br>` +
        '<extra></extra>'
    };
  }, [filteredData, selectedVar]);

  // Define the layout configuration
  const layout = useMemo(() => ({
    title: {
      text: selectedVar ? `World Map: ${selectedVar}` : 'World Map',
      x: 0.5,
      y: 0.95,
      xanchor: 'center',
      yanchor: 'top'
    },
    geo: {
      showframe: false,
      showcoastlines: true,
      projection: {
        type: 'mercator'
      },
      bgcolor: 'rgba(0,0,0,0)'
    },
    margin: {
      t: 50,
      b: 0,
      l: 0,
      r: 0
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    autosize: true
  }), [selectedVar]);

  // Handle window resize for responsive scaling
  const config = {
    responsive: true,
    displayModeBar: false
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '500px',
      position: 'relative'
    }}>
      <Plot
        data={[traceData]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default WorldMap; 