import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, CircularProgress, Alert, Box, Typography, Tooltip } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const DataTable = ({ 
  data = [], 
  isLoading = false, 
  selectedCountryIso = null,
  selectedVar = '',
  variableDescriptions = {}
}) => {
  const theme = useTheme();

  // Define columns configuration
  const columns = useMemo(() => [
    { 
      field: 'country', 
      headerName: 'Country', 
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    { 
      field: 'battAlias', 
      headerName: 'Battery Type', 
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    { 
      field: 'var', 
      headerName: selectedVar && variableDescriptions[selectedVar] 
        ? variableDescriptions[selectedVar] 
        : 'Variable',
      flex: 0.8,
      minWidth: 120 
    },
    { 
      field: 'val', 
      headerName: 'Value', 
      flex: 0.8,
      minWidth: 100,
      type: 'number',
      valueFormatter: (params) => {
        const value = Number(params.value);
        return isNaN(value) ? params.value : value.toFixed(2);
      }
    },
    { 
      field: 'cnt_vhcl', 
      headerName: 'Vehicles', 
      flex: 1,
      minWidth: 120,
      type: 'number',
      valueFormatter: (params) => {
        const value = Number(params.value);
        return isNaN(value) ? params.value : value.toLocaleString();
      }
    },
    { 
      field: 'continent', 
      headerName: 'Continent', 
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    { 
      field: 'climate', 
      headerName: 'Climate', 
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    }
  ], [selectedVar, variableDescriptions]);

  // Add unique IDs to rows and validate data
  const rows = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data
      .filter(item => !selectedCountryIso || item.iso_a3 === selectedCountryIso)
      .map((item, index) => ({
        id: `${item.iso_a3}-${item.battAlias}-${item.var}-${index}`,
        ...item
      }))
      .filter(row => {
        // Validate that all required fields have values
        return row.country && row.battAlias && row.var && 
               (row.val !== undefined && row.val !== null) && 
               (row.cnt_vhcl !== undefined && row.cnt_vhcl !== null);
      });
  }, [data, selectedCountryIso]);

  // Render empty state
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <ErrorOutlineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      position: 'relative',
      height: 600,
      width: '100%',
      bgcolor: 'background.paper',
      borderRadius: 1,
      overflow: 'hidden',
      boxShadow: 1
    }}>
      {isLoading ? (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1,
        }}>
          <CircularProgress />
        </Box>
      ) : null}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        density="comfortable"
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderColor: theme.palette.divider,
            py: 1,
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
            '& .MuiDataGrid-columnHeader': {
              py: 1.5,
              '&:focus': {
                outline: 'none',
              },
            },
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              bgcolor: theme.palette.action.hover,
            },
            '&.Mui-selected': {
              bgcolor: theme.palette.action.selected,
              '&:hover': {
                bgcolor: theme.palette.action.selected,
              },
            },
          },
        }}
      />
    </Box>
  );
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    country: PropTypes.string,
    battAlias: PropTypes.string,
    var: PropTypes.string,
    val: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    cnt_vhcl: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    continent: PropTypes.string,
    climate: PropTypes.string,
    iso_a3: PropTypes.string,
  })),
  isLoading: PropTypes.bool,
  selectedCountryIso: PropTypes.string,
  selectedVar: PropTypes.string,
  variableDescriptions: PropTypes.objectOf(PropTypes.string),
};

export default DataTable; 