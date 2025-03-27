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
  AlertTitle,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  TableChart as TableChartIcon,
  TableChartOutlined as TableChartOutlinedIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorOutlineIcon,
  Close as CloseIcon,
  FileDownload as FileDownloadIcon,
  HelpOutline as HelpOutlineIcon,
  InfoOutlined as InfoOutlinedIcon,
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
    isLoading, 
    isFiltering, 
    isRefreshing,
    error, 
    refetch,
    setIsFiltering 
  } = useKpiData();
  const { toggleDarkMode, isDarkMode } = useTheme();
  const [showError, setShowError] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  
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
  const [showTable, setShowTable] = useState(true);

  // Handle error state changes
  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Callback to handle filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    console.log('Filter changed:', newFilters);  // Debug log
    setIsFiltering(true);
    setSelectedFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, [setIsFiltering]);

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

  // Handler for resetting country selection
  const handleResetSelection = useCallback(() => {
    setSelectedCountryIso(null);
    setSelectedFilters(prev => ({
      ...prev,
      country: ''
    }));
  }, []);

  // Effect to filter data based on selected filters
  useEffect(() => {
    if (!kpiData || !Array.isArray(kpiData)) {
      console.log('No data available for filtering');  // Debug log
      setFilteredData([]);
      setIsFiltering(false);
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
    setIsFiltering(false);
  }, [kpiData, selectedFilters, setIsFiltering]);

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
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          >
            World KPI Dashboard
          </Typography>
          
          <Tooltip title="Export filtered data">
            <IconButton
              color="inherit"
              onClick={() => {
                // Export filtered data as CSV
                if (filteredData.length > 0) {
                  const header = Object.keys(filteredData[0]).join(',');
                  const csv = [
                    header,
                    ...filteredData.map(row => Object.values(row).map(val => 
                      typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
                    ).join(','))
                  ].join('\n');
                  
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', 'world_kpi_filtered_data.csv');
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              disabled={!filteredData.length}
              sx={{ mr: 1 }}
            >
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Data Source Information">
            <IconButton
              color="inherit"
              onClick={() => setOpenInfoDialog(true)}
              sx={{ mr: 1 }}
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Help">
            <IconButton
              color="inherit"
              onClick={() => setOpenHelpDialog(true)}
              sx={{ mr: 1 }}
            >
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={showTable ? "Hide data table" : "Show data table"}>
            <IconButton 
              color="inherit" 
              onClick={() => setShowTable(!showTable)}
              sx={{ mr: 1 }}
            >
              {showTable ? <TableChartIcon /> : <TableChartOutlinedIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isDarkMode ? "Light mode" : "Dark mode"}>
            <IconButton 
              onClick={toggleDarkMode} 
              color="inherit"
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Sidebar
        kpiData={kpiData}
        selectedFilters={selectedFilters}
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading || isFiltering}
      />

      <Box component="main" sx={styles.main}>
        <Toolbar /> {/* Spacer for AppBar */}
        <MainContent
          kpiData={kpiData}
          filteredData={filteredData}
          selectedFilters={selectedFilters}
          selectedCountryIso={selectedCountryIso}
          onCountryClick={handleCountryClick}
          onResetSelection={handleResetSelection}
          showTable={showTable}
          isLoading={isLoading || isFiltering}
        />
      </Box>

      {/* Global loading backdrop for refreshing */}
      <Backdrop
        sx={styles.backdrop}
        open={isRefreshing}
        onClick={() => {}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity={error?.severity || 'error'}
          sx={styles.errorAlert}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowError(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>{error?.message}</AlertTitle>
          {error?.detail}
        </Alert>
      </Snackbar>

      {/* Help Dialog */}
      <Dialog 
        open={openHelpDialog} 
        onClose={() => setOpenHelpDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          How to Use the Dashboard
          <IconButton
            aria-label="close"
            onClick={() => setOpenHelpDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>Map Navigation</Typography>
          <Typography paragraph>
            The choropleth map displays KPI values across countries. Darker colors represent lower values, while brighter colors indicate higher values. 
          </Typography>
          <Typography paragraph>
            <strong>Interacting with the map:</strong>
            <ul>
              <li>Click on a country to select it and view its details</li>
              <li>Click on the map background to reset selection</li>
              <li>Hover over a country to see its value</li>
              <li>Use the buttons in the top-right corner of the map to zoom, pan, and reset the view</li>
            </ul>
          </Typography>
          
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Typography paragraph>
            Use the sidebar filters to narrow down the data:
            <ul>
              <li><strong>Battery Alias:</strong> Filter by battery type</li>
              <li><strong>Variable:</strong> Select the KPI variable to display</li>
              <li><strong>Continent:</strong> Filter by geographical region</li>
              <li><strong>Climate:</strong> Filter by climate zone</li>
              <li><strong>Year Range:</strong> Filter by time period (if available)</li>
            </ul>
          </Typography>
          
          <Typography variant="h6" gutterBottom>Data Table</Typography>
          <Typography paragraph>
            The data table shows detailed records based on your selected filters:
            <ul>
              <li>Click column headers to sort the data</li>
              <li>Use the search box to find specific values</li>
              <li>Adjust the number of rows displayed using the pagination controls</li>
              <li>Export the filtered table data using the download button</li>
            </ul>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHelpDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Info Dialog */}
      <Dialog 
        open={openInfoDialog} 
        onClose={() => setOpenInfoDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          About World KPI Dashboard
          <IconButton
            aria-label="close"
            onClick={() => setOpenInfoDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>Data Source</Typography>
          <Typography paragraph>
            The dashboard visualizes data from the <code>world_kpi_anonym.csv</code> dataset. This dataset contains key performance indicators (KPIs) for various battery types across different countries.
          </Typography>
          
          <Typography variant="h6" gutterBottom>Key Metrics</Typography>
          <Typography paragraph>
            <ul>
              <li><strong>val:</strong> The main KPI value being measured for the given variable</li>
              <li><strong>cnt_vhcl:</strong> Number of vehicles associated with each data point</li>
              <li><strong>battAlias:</strong> Anonymized battery type identifier</li>
              <li><strong>var:</strong> Variable being measured (e.g., performance, efficiency)</li>
            </ul>
          </Typography>
          
          <Typography variant="h6" gutterBottom>Methodology</Typography>
          <Typography paragraph>
            The choropleth map visualizes the average KPI values for each country based on the selected filters. When multiple data points exist for a country, the values are averaged. Countries with no data for the selected filters are shown in white.
          </Typography>
          
          <Typography variant="h6" gutterBottom>Data Updates</Typography>
          <Typography paragraph>
            This dashboard pulls data from a static CSV file. For the most up-to-date information, contact the data management team.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInfoDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
