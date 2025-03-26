import React from 'react';
import PropTypes from 'prop-types';
import { Box, Toolbar } from '@mui/material';
import Map from './Map';
import Filters from './Filters';

const styles = {
  container: {
    flexGrow: 1,
    p: 3,
  },
  datasetInfo: {
    mb: 2,
  },
};

const MainContent = ({ data, selectedMetric, selectedBattAlias, onMetricChange, onBattAliasChange }) => {
  return (
    <Box sx={styles.container}>
      <Toolbar /> {/* Spacer to align with AppBar */}
      <Box sx={styles.datasetInfo}>
        Loaded {data.length} datasets
      </Box>
      <Filters
        data={data}
        selectedMetric={selectedMetric}
        selectedBattAlias={selectedBattAlias}
        onMetricChange={onMetricChange}
        onBattAliasChange={onBattAliasChange}
      />
      <Map
        data={data}
        selectedMetric={selectedMetric}
        selectedBattAlias={selectedBattAlias}
      />
    </Box>
  );
};

MainContent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    iso_a3: PropTypes.string,
    country: PropTypes.string,
    battAlias: PropTypes.string,
    var: PropTypes.string,
    val: PropTypes.number,
    cnt_vhcl: PropTypes.number,
  })).isRequired,
  selectedMetric: PropTypes.string.isRequired,
  selectedBattAlias: PropTypes.string.isRequired,
  onMetricChange: PropTypes.func.isRequired,
  onBattAliasChange: PropTypes.func.isRequired,
};

export default MainContent; 