import { useState } from 'react';
import api from '../utils/api';

export default url => {
  const [isLoading, setIsLoading] = useState(false);

  const post = async data => {
    try {
      setIsLoading(true);
      const res = await api.post(url, data);
      setIsLoading(false);
      return res;
    } catch (err) {
      setIsLoading(false);
      throw new Error(err);
    }
  };

  return { isLoading, post };
};
