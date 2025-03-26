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

const MainContent = ({ data, selectedFilters, selectedCountryIso, onCountryClick }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLoading = !data || data.length === 0;

  // Calculate statistics
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
    const totalVehicles = data.reduce((sum, item) => sum + (item.cnt_vhcl || 0), 0);
    const uniqueBatteries = new Set(data.map(item => item.battAlias)).size;

    // Get selected country data and calculate its stats
    const selectedCountryData = selectedCountryIso
      ? data.filter(item => item.iso_a3 === selectedCountryIso)
      : null;

    const selectedCountryStats = selectedCountryData ? {
      country: selectedCountryData[0].country,
      totalVehicles: selectedCountryData.reduce((sum, item) => sum + (item.cnt_vhcl || 0), 0),
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
                  : "Currently selected country"
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
              subtitle="Number of countries in dataset"
              icon={<PublicIcon />}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={styles.paper}>
            <InfoCard
              title="Total Vehicles"
              value={stats.totalVehicles.toLocaleString()}
              subtitle="Sum of all vehicles"
              icon={<CarIcon />}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={styles.paper}>
            <InfoCard
              title="Battery Types"
              value={stats.uniqueBatteries}
              subtitle="Unique battery configurations"
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

      {/* World Map */}
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={styles.mapPaper}>
            {isLoading ? (
              <Skeleton variant="rectangular" sx={styles.skeleton} />
            ) : (
              <WorldMap
                data={data}
                selectedMetric={selectedFilters.var}
                selectedBattAlias={selectedFilters.battAlias}
                onCountryClick={onCountryClick}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Data Table */}
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={styles.tablePaper}>
            <DataTable
              filteredData={data}
              isLoading={isLoading}
              error={null}
            />
          </Paper>
        </Grid>
      </Grid>
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
  selectedFilters: PropTypes.shape({
    battAlias: PropTypes.string,
    var: PropTypes.string,
    continent: PropTypes.string,
    country: PropTypes.string,
  }).isRequired,
  selectedCountryIso: PropTypes.string,
  onCountryClick: PropTypes.func.isRequired,
};

export default MainContent; 