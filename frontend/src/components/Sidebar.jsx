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
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import FilterPanel from './FilterPanel';

const drawerWidth = 240;

const Sidebar = ({ 
  kpiData = [], 
  selectedFilters, 
  onFiltersChange, 
  isLoading = false 
}) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar /> {/* Spacer for AppBar */}
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <FilterIcon />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" color="text.secondary">
                Filters
              </Typography>
            </ListItemText>
          </ListItem>
        </List>
        <FilterPanel
          kpiData={kpiData}
          selectedFilters={selectedFilters}
          onFiltersChange={onFiltersChange}
          isLoading={isLoading}
        />
      </Box>
    </Drawer>
  );
};

Sidebar.propTypes = {
  kpiData: PropTypes.arrayOf(PropTypes.shape({
    battAlias: PropTypes.string,
    var: PropTypes.string,
    continent: PropTypes.string,
    climate: PropTypes.string,
    country: PropTypes.string,
    iso_a3: PropTypes.string,
  })),
  selectedFilters: PropTypes.shape({
    battAlias: PropTypes.string,
    var: PropTypes.string,
    continent: PropTypes.string,
    climate: PropTypes.string,
    country: PropTypes.string,
  }).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default Sidebar; 