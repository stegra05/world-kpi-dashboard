import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Typography,
  LinearProgress,
  InputAdornment,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardHeader,
  CardContent,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { formatNumber } from '../utils/formatUtils';

// Define column configuration
const columns = [
  { id: 'iso_a3', label: 'ISO', minWidth: 60, align: 'left' },
  { id: 'country', label: 'Country', minWidth: 120, align: 'left' },
  { id: 'continent', label: 'Continent', minWidth: 100, align: 'left' },
  { id: 'battAlias', label: 'Battery Type', minWidth: 120, align: 'left' },
  { id: 'var', label: 'Variable', minWidth: 100, align: 'left' },
  { id: 'val', label: 'Value', minWidth: 80, align: 'right', format: (value) => formatNumber(value) },
  { id: 'cnt_vhcl', label: 'Vehicles', minWidth: 80, align: 'right', format: (value) => formatNumber(value) },
  { id: 'climate', label: 'Climate', minWidth: 100, align: 'left' },
];

function DataTable({ data = [], isLoading = false, selectedFilters = {} }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('cnt_vhcl');
  const [searchTerm, setSearchTerm] = useState('');

  // Apply filtering and sorting to data
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    let filteredData = [...data];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(row => 
        Object.values(row).some(value => 
          value && value.toString().toLowerCase().includes(searchLower)
        )
      );
    }
    
    // Apply column sorting
    filteredData.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string values
      const aString = aValue ? aValue.toString().toLowerCase() : '';
      const bString = bValue ? bValue.toString().toLowerCase() : '';
      
      return order === 'asc' 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
    
    return filteredData;
  }, [data, searchTerm, order, orderBy]);

  // Get active filters as array for display
  const activeFilters = useMemo(() => {
    return Object.entries(selectedFilters)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => ({ key, value }));
  }, [selectedFilters]);

  // Event handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    
    const header = columns.map(column => column.label).join(',');
    const rows = filteredData.map(row => 
      columns.map(column => {
        const value = row[column.id];
        // Format strings with commas in quotes
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    );
    
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'world_kpi_table_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Display placeholder if no data
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No data available. Please adjust your filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <Card elevation={1} sx={{ width: '100%', overflow: 'hidden' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Data Table</Typography>
            <Box>
              <Tooltip title="Export as CSV">
                <IconButton onClick={handleExportCSV} disabled={!filteredData.length}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        }
        action={
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        }
        sx={{ pb: 0 }}
      />
      
      {activeFilters.length > 0 && (
        <Box sx={{ px: 2, py: 1, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          <FilterListIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
          {activeFilters.map(({ key, value }) => (
            <Chip
              key={key}
              label={`${key}: ${value}`}
              size="small"
              variant="outlined"
              color="primary"
            />
          ))}
        </Box>
      )}
      
      <CardContent sx={{ p: 0, pt: 1, '&:last-child': { pb: 0 } }}>
        {isLoading && <LinearProgress />}
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="kpi data table" size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
}

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  selectedFilters: PropTypes.object,
};

export default DataTable;