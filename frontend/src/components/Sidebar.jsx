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
  Paper,
  Badge,
  ListItemButton,
  useTheme,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FilterList as FilterIcon,
  Public as PublicIcon,
  BatteryChargingFull as BatteryIcon,
} from '@mui/icons-material';
import FilterPanel from './FilterPanel';

const drawerWidth = 240;

const Sidebar = ({ 
  selectedFilters, 
  onFiltersChange, 
  stats = { battTypes: 0, varTypes: 0 }
}) => {
  const theme = useTheme();
  
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.background.default
            : theme.palette.background.paper,
          borderRight: '1px solid',
          borderColor: 'divider',
          boxShadow: theme.palette.mode === 'dark' 
            ? 'none' 
            : '2px 0 8px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Toolbar 
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1],
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.background.paper
            : 'primary.main',
          color: theme.palette.mode === 'dark' ? 'text.primary' : 'white',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          World KPI
        </Typography>
      </Toolbar>
      
      <Box sx={{ overflow: 'auto' }}>
        <List component="nav" disablePadding>
          <ListItemButton selected sx={{ py: 1.5 }}>
            <ListItemIcon>
              <DashboardIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="body1" fontWeight={600}>
                  Dashboard
                </Typography>
              } 
            />
          </ListItemButton>
          
          <Divider />
          
          <Box sx={{ p: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'rgba(0,0,0,0.02)',
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Dashboard Statistics
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'rgba(25, 118, 210, 0.2)'
                        : 'rgba(25, 118, 210, 0.1)',
                      width: 24,
                      height: 24,
                      mr: 1,
                    }}
                  >
                    <BatteryIcon fontSize="small" color="primary" />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {stats.battTypes} Battery Types
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(25, 118, 210, 0.2)'
                      : 'rgba(25, 118, 210, 0.1)',
                    width: 24,
                    height: 24,
                    mr: 1,
                  }}
                >
                  <PublicIcon fontSize="small" color="primary" />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {stats.varTypes} KPI Metrics
                </Typography>
              </Box>
            </Paper>
          </Box>
          
          <ListItem sx={{ pt: 0 }}>
            <ListItemIcon>
              <FilterIcon color="primary" />
            </ListItemIcon>
            <ListItemText>
              <Typography 
                variant="subtitle2" 
                color="primary" 
                sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                Data Filters
              </Typography>
            </ListItemText>
          </ListItem>
        </List>
        
        <FilterPanel
          selectedFilters={selectedFilters}
          onFiltersChange={onFiltersChange}
        />
      </Box>
    </Drawer>
  );
};

Sidebar.propTypes = {
  selectedFilters: PropTypes.object.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  stats: PropTypes.shape({
    battTypes: PropTypes.number,
    varTypes: PropTypes.number,
  }),
};

export default Sidebar; 