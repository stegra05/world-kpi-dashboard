import React from 'react';
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
  Settings as SettingsIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

const Sidebar = ({ width, onThemeToggle, variant, sx }) => {
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
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <FilterListIcon />
          </ListItemIcon>
          <ListItemText primary="Filter" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <IconButton onClick={onThemeToggle} color="inherit">
          {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 