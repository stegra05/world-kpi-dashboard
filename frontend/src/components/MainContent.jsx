import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Toolbar, Grid, CircularProgress, Paper, useTheme, useMediaQuery, Skeleton, Typography } from '@mui/material';
import {
  Public as PublicIcon,
  DirectionsCar as DirectionsCarIcon,
  BatteryChargingFull as BatteryIcon,
  LocationOn as LocationIcon,
  ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material';
import WorldMap from './WorldMap';
import InfoCard from './InfoCard';
import DataTable from './DataTable';
import FilterChips from './FilterChips';
import { formatNumber } from '../utils/formatUtils';

const styles = {
  container: {
    flexGrow: 1,
    p: { xs: 1, sm: 2, md: 3 },
    transition: 'all 0.3s ease-in-out',
  },
  loadingOverlay: {
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
    backdropFilter: 'blur(2px)',
  },
  paper: {
    height: '100%',
    p: { xs: 2, sm: 3 },
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: (theme) => theme.shadows[4],
    },
  },
  mapPaper: {
    height: '100%',
    p: { xs: 1, sm: 2 },
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    minHeight: '500px',
    transition: 'all 0.3s ease-in-out',
  },
  tablePaper: {
    height: '100%',
    p: { xs: 1, sm: 2 },
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
  },
  skeleton: {
    height: '100%',
    transform: 'scale(1, 1)',
  },
};

const InfoCardSkeleton = () => (
  <Box sx={{ height: '100%', p: 2 }}>
    <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="80%" height={20} />
  </Box>
);

const MainContent = ({ 
  data = [], 
  loading = false,
  onCountryClick = () => {},
  selectedCountryIso = null,
  onResetSelection = () => {},
  selectedMetric = '',
  selectedBattAlias = '',
  showTable = true,
  metricDescription = '',
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Calculate statistics based on filtered data
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        uniqueCountries: 0,
        totalVehicles: 0,
        uniqueBatteries: 0,
        selectedCountry: 'No country selected',
        selectedCountryStats: null,
      };
    }

    const uniqueCountries = new Set(data.map(item => item.country)).size;
    const totalVehicles = data.reduce((sum, item) => sum + (Number(item.cnt_vhcl) || 0), 0);
    const uniqueBatteries = new Set(data.map(item => item.battAlias)).size;

    // Get selected country data and calculate its stats
    const selectedCountryData = selectedCountryIso
      ? data.filter(item => item.iso_a3 === selectedCountryIso)
      : null;

    const selectedCountryStats = selectedCountryData?.length > 0 ? {
      country: selectedCountryData[0].country,
      totalVehicles: selectedCountryData.reduce((sum, item) => sum + (Number(item.cnt_vhcl) || 0), 0),
      uniqueBatteries: new Set(selectedCountryData.map(item => item.battAlias)).size,
      dataPoints: selectedCountryData.length,
    } : null;

    return {
      uniqueCountries,
      totalVehicles,
      uniqueBatteries,
      selectedCountry: selectedCountryStats?.country || 'No country selected',
      selectedCountryStats,
    };
  }, [data, selectedCountryIso]);

  const renderInfoCards = () => {
    return (
      <>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={styles.paper}>
            {loading ? (
              <InfoCardSkeleton />
            ) : (
              <InfoCard
                title="Selected Country"
                value={stats.selectedCountry}
                subtitle={
                  stats.selectedCountryStats
                    ? `${formatNumber(stats.selectedCountryStats.totalVehicles)} vehicles, ${formatNumber(stats.selectedCountryStats.uniqueBatteries)} battery types`
                    : "Click a country on the map"
                }
                icon={<LocationIcon />}
              />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={styles.paper}>
            {loading ? (
              <InfoCardSkeleton />
            ) : (
              <InfoCard
                title="Countries"
                value={formatNumber(stats.uniqueCountries)}
                subtitle="Number of countries in filtered data"
                icon={<PublicIcon />}
              />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={styles.paper}>
            {loading ? (
              <InfoCardSkeleton />
            ) : (
              <InfoCard
                title="Total Vehicles"
                value={formatNumber(stats.totalVehicles)}
                subtitle="Sum of vehicles in filtered data"
                icon={<DirectionsCarIcon />}
              />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={styles.paper}>
            {loading ? (
              <InfoCardSkeleton />
            ) : (
              <InfoCard
                title="Battery Types"
                value={formatNumber(stats.uniqueBatteries)}
                subtitle="Unique battery types in filtered data"
                icon={<BatteryIcon />}
              />
            )}
          </Paper>
        </Grid>
      </>
    );
  };

  return (
    <Box sx={styles.container}>
      {selectedMetric && selectedBattAlias && (
        <Typography variant="subtitle1" sx={{ mb: 2, ml: 1 }}>
          Showing data for <strong>{selectedMetric}</strong> and battery <strong>{selectedBattAlias}</strong>
          {metricDescription && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {metricDescription}
            </Typography>
          )}
        </Typography>
      )}
      
      <Grid container spacing={2}>
        {renderInfoCards()}
        
        <Grid item xs={12}>
          <Paper elevation={2} sx={styles.mapPaper}>
            {loading && (
              <Box sx={styles.loadingOverlay}>
                <CircularProgress />
              </Box>
            )}
            <WorldMap 
              data={data} 
              onCountryClick={onCountryClick}
              selectedCountryIso={selectedCountryIso}
              onResetSelection={onResetSelection}
              isLoading={loading}
            />
          </Paper>
        </Grid>
        
        {showTable && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={styles.tablePaper}>
              {loading ? (
                <Box sx={{ p: 2 }}>
                  <Skeleton variant="rectangular" height={56} />
                  <Skeleton variant="rectangular" height={400} sx={{ mt: 1 }} />
                </Box>
              ) : (
                <DataTable 
                  data={data}
                  onCountryClick={onCountryClick}
                  selectedCountryIso={selectedCountryIso}
                />
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

MainContent.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  onCountryClick: PropTypes.func,
  selectedCountryIso: PropTypes.string,
  onResetSelection: PropTypes.func,
  selectedMetric: PropTypes.string,
  selectedBattAlias: PropTypes.string,
  showTable: PropTypes.bool,
  metricDescription: PropTypes.string,
};

export default MainContent; 