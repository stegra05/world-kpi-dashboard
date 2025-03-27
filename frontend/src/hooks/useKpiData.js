import { useState, useEffect } from 'react';
import axios from 'axios';

const TIMEOUT_MS = 5000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Use the proxy URL instead of the direct backend URL
const API_URL = '/api';

const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const detail = error.response.data?.detail || 'Unknown error';
    
    switch (status) {
      case 400:
        return `Invalid request: ${detail}`;
      case 404:
        return `Resource not found: ${detail}`;
      case 500:
        return `Server error: ${detail}`;
      default:
        return `Server error (${status}): ${detail}`;
    }
  } else if (error.request) {
    // Request was made but no response received
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your connection and try again.';
    }
    return 'No response from server. Please check your connection and try again.';
  } else {
    // Error in request setup
    return `Request error: ${error.message}`;
  }
};

export const useKpiData = () => {
  const [kpiData, setKpiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDataWithRetry = async (retryCount = 0) => {
    try {
      console.log('Fetching data from:', `${API_URL}/data`);  // Add debug log
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
      setIsLoading(false);
      setError(null);
    } catch (err) {
      // Handle network errors with retry
      if (retryCount < MAX_RETRIES && (!err.response || err.code === 'ECONNABORTED')) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        return fetchDataWithRetry(retryCount + 1);
      }
      
      const errorMessage = getErrorMessage(err);
      const retryInfo = retryCount > 0 ? ` (after ${retryCount} retries)` : '';
      setError(`${errorMessage}${retryInfo}`);
      setIsLoading(false);
    }
  };

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    fetchDataWithRetry();
  };

  useEffect(() => {
    fetchDataWithRetry();
  }, []);

  return { kpiData, isLoading, error, refetch };
}; 