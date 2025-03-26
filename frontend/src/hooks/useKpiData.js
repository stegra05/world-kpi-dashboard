import { useState, useEffect } from 'react';
import axios from 'axios';

const TIMEOUT_MS = 5000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export const useKpiData = () => {
  const [kpiData, setKpiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDataWithRetry = async (retryCount = 0) => {
    try {
      const response = await axios.get('/api/data', {
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
    } catch (err) {
      if (retryCount < MAX_RETRIES && !err.response) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        return fetchDataWithRetry(retryCount + 1);
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch data';
      setError(`Error: ${errorMessage}${retryCount > 0 ? ` (after ${retryCount} retries)` : ''}`);
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