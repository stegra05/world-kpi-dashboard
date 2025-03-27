import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  CircularProgress, 
  Alert, 
  Button, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  Paper,
  Stack,
  Backdrop,
  Snackbar,
  AlertTitle
} from '@mui/material';
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  TableChart as TableChartIcon,
  TableChartOutlined as TableChartOutlinedIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorOutlineIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { useKpiData } from './hooks/useKpiData';
import FilterChips from './components/FilterChips';

const drawerWidth = 240;

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  appBar: {
    zIndex: (theme) => theme.zIndex.drawer + 1,
    width: `calc(100% - ${drawerWidth}px)`,
    ml: `${drawerWidth}px`,
  },
  main: {
    flexGrow: 1,
    width: { sm: '100%' },
    ml: { sm: 0 },
    p: 0,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    gap: 2,
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    p: 3,
  },
  errorPaper: {
    p: 3,
    maxWidth: 600,
    width: '100%',
  },
  backdrop: {
    zIndex: (theme) => theme.zIndex.drawer + 2,
  },
  errorAlert: {
    position: 'fixed',
    top: 16,
    right: 16,
    zIndex: (theme) => theme.zIndex.drawer + 3,
    maxWidth: 'calc(100% - 32px)',
    width: 'auto',
    minWidth: 300,
  },
};

const LoadingState = ({ onRetry }) => (
  <Box sx={styles.loadingContainer}>
    <CircularProgress />
    <Typography variant="body1" color="text.secondary">
      Loading KPI data...
    </Typography>
    <Button 
      variant="outlined" 
      startIcon={<RefreshIcon />}
      onClick={onRetry}
      sx={{ mt: 2 }}
    >
      Retry
    </Button>
  </Box>
);

LoadingState.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

const ErrorState = ({ error, onRetry }) => (
  <Box sx={styles.errorContainer}>
    <Paper elevation={3} sx={styles.errorPaper}>
      <Stack spacing={2} alignItems="center">
        <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main' }} />
        <Typography variant="h6" color="error">
          {error.message}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          {error.detail}
        </Typography>
        {error.retryable && (
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        )}
      </Stack>
    </Paper>
  </Box>
);

ErrorState.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['error', 'warning', 'info']).isRequired,
    retryable: PropTypes.bool.isRequired,
  }).isRequired,
  onRetry: PropTypes.func.isRequired,
};

function App() {
  const { 
    kpiData, 
    filteredData,
    isLoading, 
    isFiltering, 
    isRefreshing,
    error, 
    refetch,
    fetchFilteredData,
    setIsFiltering 
  } = useKpiData();
  const { toggleDarkMode, isDarkMode } = useTheme();
  const [showError, setShowError] = useState(false);
  
  // Centralized filter state
  const [selectedFilters, setSelectedFilters] = useState({
    battAlias: '',
    var: '',
    continent: '',
    country: '',
    climate: '',
  });
  const [selectedCountryIso, setSelectedCountryIso] = useState(null);
  const [showTable, setShowTable] = useState(true);

  // Handle error state changes
  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Initialize filters once data is loaded
  useEffect(() => {
    // Only run when kpiData is loaded and filters are empty
    if (kpiData.length > 0 && !selectedFilters.var && !selectedFilters.battAlias) {
      const uniqueMetrics = [...new Set(kpiData.map(item => item.var))];
      const uniqueBatteries = [...new Set(kpiData.map(item => item.battAlias))];
      
      if (uniqueMetrics.length > 0 && uniqueBatteries.length > 0) {
        const initialFilters = {
          var: uniqueMetrics[0],
          battAlias: uniqueBatteries[0],
          continent: '',
          country: '',
          climate: ''
        };
        
        console.log('Initializing filters:', initialFilters);
        setSelectedFilters(initialFilters);
        
        // Also fetch the filtered data to ensure consistency
        fetchFilteredData(initialFilters);
      }
    }
  }, [kpiData, selectedFilters.var, selectedFilters.battAlias, fetchFilteredData]);

  // Callback to handle filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    console.log('Filter changed:', newFilters);  // Debug log
    
    // Update the selected filters state
    const updatedFilters = {
      ...selectedFilters,
      ...newFilters
    };
    setSelectedFilters(updatedFilters);

    // If metric (var) and battery alias are set, trigger server-side filtering
    if (updatedFilters.var && updatedFilters.battAlias) {
      fetchFilteredData(updatedFilters);
    }
  }, [selectedFilters, fetchFilteredData]);

  // Handler for country click
  const handleCountryClick = useCallback((isoCode) => {
    if (!isoCode) return;
    
    setSelectedCountryIso(isoCode);
    // Find the country name from kpiData
    const countryData = kpiData?.find(item => item.iso_a3 === isoCode);
    if (countryData) {
      handleFiltersChange({
        country: countryData.country
      });
    } else {
      // If country not found, clear the selection
      setSelectedCountryIso(null);
      handleFiltersChange({
        country: ''
      });
      console.warn(`Country with ISO code ${isoCode} not found in data`);
    }
  }, [kpiData, handleFiltersChange]);

  // Handler for resetting country selection
  const handleResetSelection = useCallback(() => {
    setSelectedCountryIso(null);
    handleFiltersChange({
      country: ''
    });
  }, [handleFiltersChange]);

  if (isLoading) {
    return <LoadingState onRetry={refetch} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Box sx={styles.root}>
      <AppBar position="fixed" sx={styles.appBar}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'medium',
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            World KPI Dashboard
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              color="inherit" 
              onClick={() => setShowTable(prev => !prev)} 
              aria-label={showTable ? "Hide table" : "Show table"}
              sx={{ mr: 1 }}
            >
              {showTable ? <TableChartIcon /> : <TableChartOutlinedIcon />}
            </IconButton>
            <IconButton 
              color="inherit" 
              onClick={toggleDarkMode} 
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Sidebar 
        selectedFilters={selectedFilters}
        onFiltersChange={handleFiltersChange}
        stats={{
          battTypes: Array.from(new Set(kpiData.map(item => item.battAlias))).length,
          varTypes: Array.from(new Set(kpiData.map(item => item.var))).length,
        }}
        kpiData={kpiData}
      />
      
      <Box component="main" sx={styles.main}>
        <Toolbar />
        
        <FilterChips
          selectedFilters={selectedFilters}
          onResetSelection={handleFiltersChange}
        />
        
        <MainContent 
          kpiData={kpiData}
          filteredData={filteredData}
          selectedFilters={selectedFilters}
          selectedCountryIso={selectedCountryIso}
          onCountryClick={handleCountryClick}
          onResetSelection={handleResetSelection}
          showTable={showTable}
          isLoading={isLoading}
          isMapLoading={isFiltering}
        />
      </Box>
      
      <Backdrop
        sx={styles.backdrop}
        open={isFiltering}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert
          severity={error?.severity || 'error'}
          variant="filled"
          onClose={() => setShowError(false)}
          sx={{ width: '100%' }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setShowError(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <AlertTitle>{error?.message}</AlertTitle>
          {error?.detail}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
