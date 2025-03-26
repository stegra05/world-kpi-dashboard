import { useState, useEffect } from 'react';
import axios from 'axios';

const TIMEOUT_MS = 5000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

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
      const response = await axios.get(`${API_URL}/api/data`, {
        timeout: TIMEOUT_MS,
        validateStatus: status => status === 200
      });

      // Basic data validation
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid data format: Expected an array');
      }

      const isValidData = response.data.every(item => 
        item && 
        typeof item === 'object' &&
        'iso_a3' in item &&
        'var' in item &&
        'battAlias' in item &&
        'val' in item
      );

      if (!isValidData) {
        throw new Error('Invalid data format: Missing required fields');
      }

      setKpiData(response.data);
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