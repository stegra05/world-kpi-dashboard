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
  Stack
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { useKpiData } from './hooks/useKpiData';
import { useTheme } from './context/ThemeContext';

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
    width: { sm: `calc(100% - ${drawerWidth}px)` },
    ml: { sm: `${drawerWidth}px` },
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

const ErrorState = ({ error, onRetry }) => {
  // Determine error severity based on message
  const isNetworkError = error.toLowerCase().includes('connection') || 
                        error.toLowerCase().includes('timeout');
  const isServerError = error.toLowerCase().includes('server error');
  const isNotFound = error.toLowerCase().includes('not found');
  
  const severity = isNetworkError ? 'warning' : 
                   isServerError ? 'error' : 
                   isNotFound ? 'info' : 'error';

  return (
    <Box sx={styles.errorContainer}>
      <Paper elevation={3} sx={styles.errorPaper}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorOutlineIcon color={severity} />
            <Typography variant="h6" component="div">
              {isNetworkError ? 'Connection Error' :
               isServerError ? 'Server Error' :
               isNotFound ? 'Resource Not Found' :
               'Error'}
            </Typography>
          </Box>
          
          <Alert 
            severity={severity}
            sx={{ mt: 1 }}
          >
            {error}
          </Alert>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Retry
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

ErrorState.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

function App() {
  const { kpiData, isLoading, error, refetch } = useKpiData();
  const { toggleDarkMode, isDarkMode } = useTheme();
  
  // Centralized filter state
  const [selectedFilters, setSelectedFilters] = useState({
    battAlias: '',
    var: '',
    continent: '',
    country: '',
    climate: '',
  });
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCountryIso, setSelectedCountryIso] = useState(null);

  // Callback to handle filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    console.log('Filter changed:', newFilters);  // Debug log
    setSelectedFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Handler for country click
  const handleCountryClick = useCallback((isoCode) => {
    if (!isoCode) return;
    
    setSelectedCountryIso(isoCode);
    // Find the country name from kpiData
    const countryData = kpiData?.find(item => item.iso_a3 === isoCode);
    if (countryData) {
      setSelectedFilters(prev => ({
        ...prev,
        country: countryData.country
      }));
    } else {
      // If country not found, clear the selection
      setSelectedCountryIso(null);
      setSelectedFilters(prev => ({
        ...prev,
        country: ''
      }));
      console.warn(`Country with ISO code ${isoCode} not found in data`);
    }
  }, [kpiData]);

  // Effect to filter data based on selected filters
  useEffect(() => {
    if (!kpiData || !Array.isArray(kpiData)) {
      console.log('No data available for filtering');  // Debug log
      setFilteredData([]);
      return;
    }

    console.log('Filtering data with:', selectedFilters);  // Debug log
    let filtered = [...kpiData];

    // Apply filters
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value && filtered.length > 0) {
        filtered = filtered.filter(item => item[key] === value);
      }
    });

    console.log('Filtered data length:', filtered.length);  // Debug log
    setFilteredData(filtered);
  }, [kpiData, selectedFilters]);

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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            World KPI Dashboard
          </Typography>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Sidebar
        kpiData={kpiData}
        selectedFilters={selectedFilters}
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading}
      />

      <Box component="main" sx={styles.main}>
        <Toolbar /> {/* Spacer for AppBar */}
        <MainContent
          kpiData={kpiData}
          filteredData={filteredData}
          selectedFilters={selectedFilters}
          selectedCountryIso={selectedCountryIso}
          onCountryClick={handleCountryClick}
        />
      </Box>
    </Box>
  );
}

export default App;
