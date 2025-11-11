import { useState, useEffect, useCallback } from 'react';

const useApi = (apiFunc, options = { immediate: true }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(options.immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunc(...args);
      setData(response); 
      return { response };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An unknown error occurred';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return { data, loading, error, execute };
};

export default useApi;