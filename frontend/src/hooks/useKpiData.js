import { useState, useEffect } from 'react';
import axios from 'axios';

const TIMEOUT_MS = 5000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Use the proxy URL instead of the direct backend URL
// and include the full path with version
const API_URL = '/api/v1';

const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const detail = error.response.data?.detail || 'Unknown error';
    
    switch (status) {
      case 400:
        return {
          message: 'Invalid request',
          detail: detail,
          severity: 'warning',
          retryable: true
        };
      case 404:
        return {
          message: 'Resource not found',
          detail: detail,
          severity: 'info',
          retryable: false
        };
      case 500:
        return {
          message: 'Server error',
          detail: detail,
          severity: 'error',
          retryable: true
        };
      default:
        return {
          message: `Server error (${status})`,
          detail: detail,
          severity: 'error',
          retryable: true
        };
    }
  } else if (error.request) {
    // Request was made but no response received
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timed out',
        detail: 'Please check your connection and try again.',
        severity: 'warning',
        retryable: true
      };
    }
    return {
      message: 'No response from server',
      detail: 'Please check your connection and try again.',
      severity: 'warning',
      retryable: true
    };
  } else {
    // Error in request setup
    return {
      message: 'Request error',
      detail: error.message,
      severity: 'error',
      retryable: false
    };
  }
};

export const useKpiData = () => {
  const [kpiData, setKpiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [variableDescriptions, setVariableDescriptions] = useState({});
  const [filteredData, setFilteredData] = useState([]);

  const fetchDataWithRetry = async (retryCount = 0, isRefresh = false) => {
    try {
      console.log('Fetching data from:', `${API_URL}/data`);
      const response = await axios.get(`${API_URL}/data`, {
        timeout: TIMEOUT_MS,
        validateStatus: status => status === 200
      });

      // Basic data validation
      if (!response.data) {
        throw new Error('No data received from server');
      }

      if (!Array.isArray(response.data)) {
        console.error('Invalid response data:', response.data);
        throw new Error('Invalid data format: Expected an array');
      }

      if (response.data.length === 0) {
        throw new Error('No data available');
      }

      // Log first record for debugging
      console.debug('First record:', response.data[0]);

      const isValidData = response.data.every(item => {
        const isValid = item && 
          typeof item === 'object' &&
          typeof item.iso_a3 === 'string' &&
          item.iso_a3.length > 0 &&
          item.iso_a3.length <= 3 &&
          typeof item.country === 'string' &&
          typeof item.battAlias === 'string' &&
          typeof item.var === 'string' &&
          !isNaN(parseFloat(item.val));  // More lenient number validation

        if (!isValid && item) {
          console.warn('Invalid item:', item);
          console.warn('Validation details:', {
            hasIso: typeof item.iso_a3 === 'string',
            isoLength: item.iso_a3?.length,
            hasCountry: typeof item.country === 'string',
            hasBattAlias: typeof item.battAlias === 'string',
            hasVar: typeof item.var === 'string',
            hasValidVal: !isNaN(parseFloat(item.val))
          });
        }
        return isValid;
      });

      if (!isValidData) {
        console.error('Invalid data structure:', response.data[0]);
        throw new Error('Invalid data format: Missing or invalid required fields');
      }

      // Create mapping of variable descriptions
      const descriptions = response.data.reduce((acc, item) => {
        if (item.var && item.descr) {
          acc[item.var] = item.descr;
        }
        return acc;
      }, {});
      setVariableDescriptions(descriptions);

      // Add climate field if not present in any item and ensure proper types
      const dataWithClimate = response.data.map(item => ({
        ...item,
        iso_a3: String(item.iso_a3 || '').slice(0, 3),
        country: String(item.country || ''),
        battAlias: String(item.battAlias || ''),
        var: String(item.var || ''),
        val: parseFloat(item.val),
        cnt_vhcl: parseInt(item.cnt_vhcl || 0, 10),
        continent: String(item.continent || ''),
        climate: String(item.climate || '')
      }));

      setKpiData(dataWithClimate);
      
      // Don't set filtered data here - wait for explicit filter application
      // This prevents redundant data loading
      
      setIsLoading(false);
      setIsRefreshing(false);
      setError(null);
      
      return dataWithClimate; // Return the processed data
    } catch (err) {
      // Handle network errors with retry
      if (retryCount < MAX_RETRIES && (!err.response || err.code === 'ECONNABORTED')) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        return fetchDataWithRetry(retryCount + 1, isRefresh);
      }
      
      const errorInfo = getErrorMessage(err);
      const retryInfo = retryCount > 0 ? ` (after ${retryCount} retries)` : '';
      setError({
        ...errorInfo,
        detail: `${errorInfo.detail}${retryInfo}`
      });
      setIsLoading(false);
      setIsRefreshing(false);
      return null;
    }
  };

  const fetchFilteredData = async (filters, retryCount = 0) => {
    if (!filters || !filters.var || !filters.battAlias) {
      console.warn('Skipping filter request - missing required filters', filters);
      return;
    }

    try {
      setIsFiltering(true);
      console.log('Fetching filtered data with:', filters);
      
      // Construct query params for the endpoint
      const params = {
        metric: filters.var,
        batt_alias: filters.battAlias,
        ...(filters.continent && { continent: filters.continent }),
        ...(filters.climate && { climate: filters.climate })
      };
      
      const url = `${API_URL}/data/filtered`;
      console.log('Making request to:', url, 'with params:', params);
      
      const response = await axios.get(url, {
        params,
        timeout: TIMEOUT_MS,
        validateStatus: status => status === 200,
        paramsSerializer: params => {
          return Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        }
      });

      // Basic data validation
      if (!response.data || !response.data.data) {
        console.error('Unexpected response structure:', response.data);
        throw new Error('No data received from server or invalid response structure');
      }

      if (!Array.isArray(response.data.data)) {
        console.error('Invalid response data:', response.data);
        throw new Error('Invalid data format: Expected an array in data property');
      }

      // Log first record for debugging
      if (response.data.data.length > 0) {
        console.debug('First filtered record:', response.data.data[0]);
        console.debug('Total filtered records:', response.data.data.length);
      } else {
        console.warn('No records returned from filter query', params);
        setFilteredData([]);
        setIsFiltering(false);
        return;
      }
      
      // Apply country filter on client-side if needed (since it's not part of the backend filter)
      let filteredResults = response.data.data;
      if (filters.country) {
        filteredResults = filteredResults.filter(item => item.country === filters.country);
        console.log(`Applied client-side country filter, remaining: ${filteredResults.length} items`);
      }
      
      setFilteredData(filteredResults);
      setError(null);
    } catch (err) {
      // Handle network errors with retry logic
      if (retryCount < MAX_RETRIES && (!err.response || err.code === 'ECONNABORTED')) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        return fetchFilteredData(filters, retryCount + 1);
      }
      
      console.error('Error fetching filtered data:', err);
      setError(getErrorMessage(err));
    } finally {
      // Add a small delay to ensure loading state is visible (prevents flickering for fast responses)
      setTimeout(() => {
        setIsFiltering(false);
      }, 500);
    }
  };

  const refetch = () => {
    setIsRefreshing(true);
    setError(null);
    fetchDataWithRetry(0, true);
  };

  useEffect(() => {
    fetchDataWithRetry();
  }, []);

  // Set initial filtered data when kpiData first loads
  useEffect(() => {
    if (kpiData.length > 0 && filteredData.length === 0) {
      // Find the first valid metric and battery alias
      const firstMetric = [...new Set(kpiData.map(item => item.var))][0] || '';
      const firstBattAlias = [...new Set(kpiData.map(item => item.battAlias))][0] || '';
      
      if (firstMetric && firstBattAlias) {
        console.log(`Initializing filtered data with first metric "${firstMetric}" and battery "${firstBattAlias}"`);
        
        // Apply initial filter
        const initialFilters = {
          var: firstMetric,
          battAlias: firstBattAlias,
          continent: '',
          climate: '',
          country: ''
        };
        
        // Filter client-side for initial view
        const initialFiltered = kpiData.filter(
          item => item.var === firstMetric && item.battAlias === firstBattAlias
        );
        
        // Set filtered data directly for immediate rendering
        setFilteredData(initialFiltered);
        
        // Then fetch from server to ensure consistency
        fetchFilteredData(initialFilters);
      }
    }
  }, [kpiData, filteredData.length, fetchFilteredData]);

  return { 
    kpiData, 
    filteredData,
    isLoading, 
    isFiltering, 
    isRefreshing,
    error, 
    refetch,
    fetchFilteredData,
    variableDescriptions,
    setIsFiltering 
  };
}; 