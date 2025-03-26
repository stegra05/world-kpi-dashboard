import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Alert, Button, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
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
  },
};

const LoadingState = ({ onRetry }) => (
  <Box sx={styles.loadingContainer}>
    <CircularProgress />
    <Button onClick={onRetry} sx={{ mt: 2 }}>
      Retry
    </Button>
  </Box>
);

LoadingState.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

const ErrorState = ({ error, onRetry }) => (
  <Box sx={{ p: 3 }}>
    <Alert 
      severity="error" 
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      }
    >
      {error}
    </Alert>
  </Box>
);

ErrorState.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

function App() {
  const { kpiData, isLoading, error, refetch } = useKpiData();
  const { toggleDarkMode, isDarkMode } = useTheme();
  const [selectedMetric, setSelectedMetric] = useState('');
  const [selectedBattAlias, setSelectedBattAlias] = useState('');

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
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Sidebar 
        width={drawerWidth} 
        onThemeToggle={toggleDarkMode}
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      />
      
      <Box component="main" sx={styles.main}>
        <MainContent
          data={kpiData}
          selectedMetric={selectedMetric}
          selectedBattAlias={selectedBattAlias}
          onMetricChange={setSelectedMetric}
          onBattAliasChange={setSelectedBattAlias}
        />
      </Box>
    </Box>
  );
}

export default App;
