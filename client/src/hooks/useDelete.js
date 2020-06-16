import { useState, useCallback } from 'react';
import api from '../utils/api';

export default url => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteRequest = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.delete(url);
      return res;
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [url]);
  return { isLoading, error, delete: deleteRequest };
};
