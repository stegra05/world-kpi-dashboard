import React, { useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, CircularProgress, Alert } from '@mui/material';

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
    },
    {
      field: 'battAlias',
      headerName: 'Battery Alias',
      width: 150,
      flex: 1,
      sortable: true,
    },
    {
      field: 'var',
      headerName: 'Variable',
      width: 150,
      flex: 1,
      sortable: true,
    },
    {
      field: 'val',
      headerName: 'Value',
      width: 120,
      flex: 1,
      type: 'number',
      sortable: true,
      valueFormatter: (params) => {
        if (params.value == null) return '';
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
        if (params.value == null) return '';
        return params.value.toLocaleString();
      },
    },
  ], []);

  // Add unique IDs to rows
  const rows = useMemo(() => 
    filteredData.map((row, index) => ({
      id: `${row.country}-${row.battAlias}-${row.var}-${index}`,
      ...row,
    }))
  , [filteredData]);

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading data: {error.message}
      </Alert>
    );
  }

  return (
    <div style={{ 
      height: 400, 
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {isLoading && (
        <div style={{
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
        </div>
      )}
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
    </div>
  );
};

export default DataTable; 