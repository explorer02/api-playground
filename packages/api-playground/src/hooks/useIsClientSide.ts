import { useEffect, useState } from 'react';

export const useIsClientSide = () => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return isMounted;
};
