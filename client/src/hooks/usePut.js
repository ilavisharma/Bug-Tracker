import { useState, useCallback } from 'react';
import api from '../utils/api';

export default url => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const put = useCallback(
    async data => {
      try {
        setIsLoading(true);
        const res = await api.put(url, data, {
          headers: {
            authorization: localStorage.getItem('token')
          }
        });
        setIsLoading(false);
        return res;
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    },
    [url]
  );
  return { isLoading, error, put };
};
