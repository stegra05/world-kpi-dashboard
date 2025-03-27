import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Toolbar, Grid, CircularProgress, Paper, useTheme, useMediaQuery, Skeleton, Typography, Divider } from '@mui/material';
import {
  Public as PublicIcon,
  DirectionsCar as DirectionsCarIcon,
  BatteryChargingFull as BatteryIcon,
  LocationOn as LocationIcon,
  ErrorOutline as ErrorOutlineIcon,
  FilterAlt as FilterAltIcon,
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
    p: { xs: 2, sm: 3 },
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    minHeight: '600px',
    transition: 'all 0.3s ease-in-out',
    borderRadius: 2,
    overflow: 'hidden',
    boxShadow: (theme) => theme.shadows[3],
  },
  mapHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
    px: { xs: 1, sm: 2 },
  },
  mapContainer: {
    flexGrow: 1,
    position: 'relative',
    borderRadius: 1,
    overflow: 'hidden',
  },
  tablePaper: {
    height: '100%',
    p: { xs: 1, sm: 2 },
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    mt: 3,
  },
  skeleton: {
    height: '100%',
    transform: 'scale(1, 1)',
  },
  sectionTitle: {
    fontSize: { xs: '1.25rem', sm: '1.5rem' },
    fontWeight: 600,
    color: 'text.primary',
    mb: 2,
    mt: 4,
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
  onCountryClick,
  onResetSelection,
  showTable = true,
  isLoading = false,
  isMapLoading = false,
  mapError = null
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
            <Paper elevation={3} sx={styles.paper}>
              <InfoCardSkeleton />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={styles.paper}>
              <InfoCardSkeleton />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={styles.paper}>
              <InfoCardSkeleton />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={styles.paper}>
              <InfoCardSkeleton />
            </Paper>
          </Grid>
        </>
      );
    }

    return (
      <>
        <Grid item xs={12} sm={6} md={3}>
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
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Countries"
            value={formatNumber(stats.uniqueCountries)}
            subtitle={`Number of countries in ${selectedFilters.continent || 'all continents'}`}
            icon={<PublicIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Total Vehicles"
            value={formatNumber(stats.totalVehicles)}
            subtitle={selectedFilters.battAlias ? `Vehicles with ${selectedFilters.battAlias} batteries` : "Sum of vehicles in filtered data"}
            icon={<DirectionsCarIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Battery Types"
            value={formatNumber(stats.uniqueBatteries)}
            subtitle={selectedFilters.var ? `Batteries measuring ${selectedFilters.var}` : "Unique battery types in filtered data"}
            icon={<BatteryIcon />}
          />
        </Grid>
      </>
    );
  };

  return (
    <Box sx={styles.container}>
      <Toolbar /> {/* Spacer for AppBar */}
      
      {/* Info Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {renderInfoCards()}
      </Grid>

      {/* Section Title with Divider */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" sx={styles.sectionTitle}>
          {selectedFilters.var ? `${selectedFilters.var} Distribution by Country` : 'World KPI Distribution'}
        </Typography>
        <Divider />
      </Box>

      {/* Map Section */}
      <Paper 
        elevation={3} 
        sx={styles.mapPaper}
      >
        <Box sx={styles.mapHeader}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {selectedCountryIso ? `${stats.selectedCountry} Selected` : 'Global View'}
          </Typography>
          {selectedFilters.battAlias && (
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
              Filter: {selectedFilters.battAlias}
            </Typography>
          )}
        </Box>
        
        <Box sx={styles.mapContainer}>
          {isMapLoading && (
            <Box sx={styles.loadingOverlay}>
              <CircularProgress />
            </Box>
          )}
          {mapError ? (
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorOutlineIcon color="error" />
              <Typography color="error">{mapError}</Typography>
            </Box>
          ) : (
            <WorldMap
              data={filteredData}
              selectedVar={selectedFilters.var}
              selectedCountryIso={selectedCountryIso}
              onCountryClick={onCountryClick}
              onResetSelection={onResetSelection}
            />
          )}
        </Box>
      </Paper>

      {/* Data Table Section */}
      {showTable && (
        <>
          <Typography variant="h5" component="h2" sx={styles.sectionTitle}>
            Data Details
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Paper elevation={3} sx={styles.tablePaper}>
            <DataTable 
              data={filteredData}
              isLoading={isLoading}
              selectedCountryIso={selectedCountryIso}
            />
          </Paper>
        </>
      )}
    </Box>
  );
};

MainContent.propTypes = {
  kpiData: PropTypes.array,
  filteredData: PropTypes.array,
  selectedFilters: PropTypes.object.isRequired,
  selectedCountryIso: PropTypes.string,
  onCountryClick: PropTypes.func.isRequired,
  onResetSelection: PropTypes.func.isRequired,
  showTable: PropTypes.bool,
  isLoading: PropTypes.bool,
  isMapLoading: PropTypes.bool,
  mapError: PropTypes.string,
};

export default MainContent; 