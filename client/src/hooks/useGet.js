import { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';

export default url => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      const res = await api.get(url, {
        headers: {
          authorization: localStorage.getItem('token')
        }
      });
      setResponse(res);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setError(err);
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { response, isLoading, error, refetch: fetch };
};
