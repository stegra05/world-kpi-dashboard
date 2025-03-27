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
      
      // Initialize filtered data with all data so map has something to display
      // Find the first valid metric and battery alias 
      const firstMetric = [...new Set(dataWithClimate.map(item => item.var))][0] || '';
      const firstBattAlias = [...new Set(dataWithClimate.map(item => item.battAlias))][0] || '';
      
      if (firstMetric && firstBattAlias) {
        // Filter the initial data to show only one metric and battery combo
        const initialFiltered = dataWithClimate.filter(
          item => item.var === firstMetric && item.battAlias === firstBattAlias
        );
        console.log(`Initializing filtered data with metric "${firstMetric}" and battery "${firstBattAlias}" (${initialFiltered.length} items)`);
        setFilteredData(initialFiltered.length > 0 ? initialFiltered : dataWithClimate);
      } else {
        // Fallback to all data if no consistent metric/battery found
        setFilteredData(dataWithClimate);
      }
      
      setIsLoading(false);
      setIsRefreshing(false);
      setError(null);
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
    }
  };

  const fetchFilteredData = async (filters, retryCount = 0) => {
    if (!filters.var || !filters.battAlias) {
      // Not enough filter data available yet, don't make API request
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
      console.log('Making request to:', url);
      
      const response = await axios.get(url, {
        params,
        timeout: TIMEOUT_MS,
        validateStatus: status => status === 200
      });

      // Basic data validation
      if (!response.data || !response.data.data) {
        throw new Error('No data received from server');
      }

      if (!Array.isArray(response.data.data)) {
        console.error('Invalid response data:', response.data);
        throw new Error('Invalid data format: Expected an array in data property');
      }

      if (response.data.data.length === 0) {
        setFilteredData([]);
        setIsFiltering(false);
        return;
      }

      // Log first record for debugging
      console.debug('First filtered record:', response.data.data[0]);
      
      // Apply country filter on client-side if needed (since it's not part of the backend filter)
      let filteredResults = response.data.data;
      if (filters.country) {
        filteredResults = filteredResults.filter(item => item.country === filters.country);
        console.log(`Applied client-side country filter for "${filters.country}", remaining items: ${filteredResults.length}`);
      }
      
      // Update filtered data state with the server-filtered results
      setFilteredData(filteredResults);
      setError(null);
    } catch (err) {
      // Handle network errors with retry
      if (retryCount < MAX_RETRIES && (!err.response || err.code === 'ECONNABORTED')) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        return fetchFilteredData(filters, retryCount + 1);
      }
      
      console.error('Filter API error:', err);
      
      // If we get a 404, fall back to client-side filtering
      if (err.response && err.response.status === 404) {
        console.log('Filtered endpoint not found, falling back to client-side filtering');
        const clientFiltered = kpiData.filter(item => 
          item.var === filters.var && 
          item.battAlias === filters.battAlias &&
          (!filters.continent || item.continent === filters.continent) &&
          (!filters.climate || item.climate === filters.climate) &&
          (!filters.country || item.country === filters.country)
        );
        setFilteredData(clientFiltered);
        setError(null);
      } else {
        const errorInfo = getErrorMessage(err);
        const retryInfo = retryCount > 0 ? ` (after ${retryCount} retries)` : '';
        setError({
          ...errorInfo,
          detail: `${errorInfo.detail}${retryInfo}`
        });
      }
    } finally {
      setIsFiltering(false);
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