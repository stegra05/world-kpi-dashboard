import React, { useState } from 'react';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import Map from './components/Map';
import Filters from './components/Filters';
import Sidebar from './components/Sidebar';
import { useKpiData } from './hooks/useKpiData';
import { useTheme } from './context/ThemeContext';

const drawerWidth = 240;

function App() {
  const { kpiData, isLoading, error, refetch } = useKpiData();
  const { toggleDarkMode } = useTheme();
  const [selectedMetric, setSelectedMetric] = useState('');
  const [selectedBattAlias, setSelectedBattAlias] = useState('');

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Button onClick={refetch} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={refetch}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar width={drawerWidth} onThemeToggle={toggleDarkMode} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Box sx={{ mb: 2 }}>
          Loaded {kpiData.length} datasets
        </Box>
        <Filters
          data={kpiData}
          selectedMetric={selectedMetric}
          selectedBattAlias={selectedBattAlias}
          onMetricChange={setSelectedMetric}
          onBattAliasChange={setSelectedBattAlias}
        />
        <Map
          data={kpiData}
          selectedMetric={selectedMetric}
          selectedBattAlias={selectedBattAlias}
        />
      </Box>
    </Box>
  );
}

export default App;
