import { useLayoutEffect, useState } from 'react';

export const useIsClientSide = () => {
  const [isMounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  return isMounted;
};
