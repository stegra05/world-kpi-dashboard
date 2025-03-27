import React from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import FilterPanel from './FilterPanel';

const Sidebar = ({ width, onThemeToggle, variant, sx, data, selectedFilters, onFiltersChange, isLoading }) => {
  const theme = useTheme();

  return (
    <Drawer
      variant={variant}
      sx={{
        ...sx,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <FilterPanel
          kpiData={data}
          selectedFilters={selectedFilters}
          onFiltersChange={onFiltersChange}
          isLoading={isLoading}
        />
      </Box>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <IconButton onClick={onThemeToggle} color="inherit">
          {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>
    </Drawer>
  );
};

Sidebar.propTypes = {
  width: PropTypes.number.isRequired,
  onThemeToggle: PropTypes.func.isRequired,
  variant: PropTypes.string.isRequired,
  sx: PropTypes.object,
  data: PropTypes.array.isRequired,
  selectedFilters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default Sidebar; 