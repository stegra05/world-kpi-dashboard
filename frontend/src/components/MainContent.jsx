import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Toolbar, Grid, CircularProgress, Paper, useTheme, useMediaQuery, Skeleton } from '@mui/material';
import {
  Public as PublicIcon,
  DirectionsCar as CarIcon,
  BatteryChargingFull as BatteryIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import WorldMap from './WorldMap';
import InfoCard from './InfoCard';
import DataTable from './DataTable';

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
  kpiData = [], 
  filteredData = [], 
  selectedFilters, 
  selectedCountryIso = null, 
  onCountryClick 
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLoading = !kpiData || kpiData.length === 0;

  // Calculate statistics based on filtered data
  const stats = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        uniqueCountries: 0,
        totalVehicles: 0,
        uniqueBatteries: 0,
        selectedCountry: 'No country selected',
        selectedCountryStats: null,
      };
    }

    const uniqueCountries = new Set(filteredData.map(item => item.country)).size;
    const totalVehicles = filteredData.reduce((sum, item) => sum + (Number(item.cnt_vhcl) || 0), 0);
    const uniqueBatteries = new Set(filteredData.map(item => item.battAlias)).size;

    // Get selected country data and calculate its stats
    const selectedCountryData = selectedCountryIso
      ? filteredData.filter(item => item.iso_a3 === selectedCountryIso)
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
  }, [filteredData, selectedCountryIso]);

  const renderInfoCards = () => {
    if (isLoading) {
      return (
        <>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={styles.paper}>
              <InfoCardSkeleton />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={styles.paper}>
              <InfoCardSkeleton />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={styles.paper}>
              <InfoCardSkeleton />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={styles.paper}>
              <InfoCardSkeleton />
            </Paper>
          </Grid>
        </>
      );
    }

    return (
      <>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={styles.paper}>
            <InfoCard
              title="Selected Country"
              value={stats.selectedCountry}
              subtitle={
                stats.selectedCountryStats
                  ? `${stats.selectedCountryStats.totalVehicles.toLocaleString()} vehicles, ${stats.selectedCountryStats.uniqueBatteries} battery types`
                  : "Click a country on the map"
              }
              icon={<LocationIcon />}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={styles.paper}>
            <InfoCard
              title="Countries"
              value={stats.uniqueCountries}
              subtitle="Number of countries in filtered data"
              icon={<PublicIcon />}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={styles.paper}>
            <InfoCard
              title="Total Vehicles"
              value={stats.totalVehicles.toLocaleString()}
              subtitle="Sum of vehicles in filtered data"
              icon={<CarIcon />}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={styles.paper}>
            <InfoCard
              title="Battery Types"
              value={stats.uniqueBatteries}
              subtitle="Unique battery types in filtered data"
              icon={<BatteryIcon />}
            />
          </Paper>
        </Grid>
      </>
    );
  };

  return (
    <Box sx={styles.container}>
      <Toolbar /> {/* Spacer to align with AppBar */}
      
      {/* Info Cards */}
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        {renderInfoCards()}
      </Grid>

      {/* Map and Table */}
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* World Map */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={styles.mapPaper}>
            {isLoading ? (
              <Box sx={styles.loadingOverlay}>
                <CircularProgress />
              </Box>
            ) : (
              <WorldMap
                data={filteredData}
                selectedCountryIso={selectedCountryIso}
                onCountryClick={onCountryClick}
                selectedVar={selectedFilters.var}
              />
            )}
          </Paper>
        </Grid>

        {/* Data Table */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={styles.tablePaper}>
            <DataTable
              data={filteredData}
              isLoading={isLoading}
              selectedCountryIso={selectedCountryIso}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

MainContent.propTypes = {
  kpiData: PropTypes.arrayOf(PropTypes.shape({
    battAlias: PropTypes.string,
    var: PropTypes.string,
    continent: PropTypes.string,
    climate: PropTypes.string,
    country: PropTypes.string,
    iso_a3: PropTypes.string,
    cnt_vhcl: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    val: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })),
  filteredData: PropTypes.arrayOf(PropTypes.shape({
    battAlias: PropTypes.string,
    var: PropTypes.string,
    continent: PropTypes.string,
    climate: PropTypes.string,
    country: PropTypes.string,
    iso_a3: PropTypes.string,
    cnt_vhcl: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    val: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })),
  selectedFilters: PropTypes.shape({
    battAlias: PropTypes.string,
    var: PropTypes.string,
    continent: PropTypes.string,
    climate: PropTypes.string,
    country: PropTypes.string,
  }).isRequired,
  selectedCountryIso: PropTypes.string,
  onCountryClick: PropTypes.func.isRequired,
};

export default MainContent; 