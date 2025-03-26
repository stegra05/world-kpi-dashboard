import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';

const Filters = ({ data, selectedMetric, selectedBattAlias, onMetricChange, onBattAliasChange }) => {
  // Get unique values for filters
  const uniqueMetrics = [...new Set(data.map(item => item.var))];
  const uniqueBattAliases = [...new Set(data.map(item => item.battAlias))];

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Metric</InputLabel>
          <Select
            value={selectedMetric}
            label="Metric"
            onChange={(e) => onMetricChange(e.target.value)}
          >
            {uniqueMetrics.map((metric) => (
              <MenuItem key={metric} value={metric}>
                {metric}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Battery Alias</InputLabel>
          <Select
            value={selectedBattAlias}
            label="Battery Alias"
            onChange={(e) => onBattAliasChange(e.target.value)}
          >
            {uniqueBattAliases.map((alias) => (
              <MenuItem key={alias} value={alias}>
                {alias}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default Filters; 