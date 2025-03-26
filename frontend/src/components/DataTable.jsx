import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, CircularProgress, Alert, Box, Typography, Paper, Backdrop } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const DataTable = ({ filteredData, isLoading, error }) => {
  const theme = useTheme();

  // Define columns configuration
  const columns = useMemo(() => [
    {
      field: 'country',
      headerName: 'Country',
      width: 150,
      flex: 1,
      sortable: true,
      renderCell: (params) => params.value || 'N/A',
    },
    {
      field: 'battAlias',
      headerName: 'Battery Alias',
      width: 150,
      flex: 1,
      sortable: true,
      renderCell: (params) => params.value || 'N/A',
    },
    {
      field: 'var',
      headerName: 'Variable',
      width: 150,
      flex: 1,
      sortable: true,
      renderCell: (params) => params.value || 'N/A',
    },
    {
      field: 'val',
      headerName: 'Value',
      width: 120,
      flex: 1,
      type: 'number',
      sortable: true,
      valueFormatter: (params) => {
        if (params.value == null) return 'N/A';
        return params.value.toLocaleString();
      },
    },
    {
      field: 'cnt_vhcl',
      headerName: 'Vehicle Count',
      width: 150,
      flex: 1,
      type: 'number',
      sortable: true,
      valueFormatter: (params) => {
        if (params.value == null) return 'N/A';
        return params.value.toLocaleString();
      },
    },
  ], []);

  // Add unique IDs to rows and validate data
  const rows = useMemo(() => {
    if (!filteredData || !Array.isArray(filteredData)) return [];
    
    return filteredData.map((row, index) => ({
      id: `${row.country || 'unknown'}-${row.battAlias || 'unknown'}-${row.var || 'unknown'}-${index}`,
      ...row,
      // Ensure all required fields have values
      country: row.country || 'N/A',
      battAlias: row.battAlias || 'N/A',
      var: row.var || 'N/A',
      val: row.val ?? null,
      cnt_vhcl: row.cnt_vhcl ?? null,
    }));
  }, [filteredData]);

  // Render error state
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading data: {error.message}
        </Alert>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            textAlign: 'center',
            backgroundColor: theme.palette.background.default
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Unable to Load Data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please try refreshing the page or contact support if the problem persists.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Render empty state
  if (!isLoading && (!filteredData || filteredData.length === 0)) {
    return (
      <Box sx={{ p: 2 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            textAlign: 'center',
            backgroundColor: theme.palette.background.default
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Data Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters to see data in the table.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      position: 'relative',
      height: 400, 
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
    }}>
      <Backdrop
        sx={{
          color: theme.palette.primary.main,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: theme.zIndex.drawer + 1,
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        autoHeight
        loading={isLoading}
        disableColumnMenu={false}
        resizable
        error={error}
        onError={(error) => {
          console.error('DataGrid error:', error);
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: theme.palette.background.default,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
          '& .MuiDataGrid-sortIcon': {
            color: theme.palette.primary.main,
          },
        }}
      />
    </Box>
  );
};

DataTable.propTypes = {
  filteredData: PropTypes.arrayOf(PropTypes.shape({
    country: PropTypes.string,
    battAlias: PropTypes.string,
    var: PropTypes.string,
    val: PropTypes.number,
    cnt_vhcl: PropTypes.number,
  })),
  isLoading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};

DataTable.defaultProps = {
  filteredData: [],
  isLoading: false,
  error: null,
};

export default DataTable; 