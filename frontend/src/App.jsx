import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import axios from 'axios';
import Map from './components/Map';
import Filters from './components/Filters';
import Sidebar from './components/Sidebar';

const drawerWidth = 240;

function App() {
  const [data, setData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('');
  const [selectedBattAlias, setSelectedBattAlias] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/data');
        setData(response.data);
        // Set initial selections if data is available
        if (response.data.length > 0) {
          setSelectedMetric(response.data[0].var);
          setSelectedBattAlias(response.data[0].battAlias);
        }
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  if (loading) return <Box sx={{ p: 3 }}>Loading...</Box>;
  if (error) return <Box sx={{ p: 3, color: 'error.main' }}>{error}</Box>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar width={drawerWidth} onThemeToggle={handleThemeToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Filters
            data={data}
            selectedMetric={selectedMetric}
            selectedBattAlias={selectedBattAlias}
            onMetricChange={setSelectedMetric}
            onBattAliasChange={setSelectedBattAlias}
          />
          <Map
            data={data}
            selectedMetric={selectedMetric}
            selectedBattAlias={selectedBattAlias}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
