import { useEffect, useState } from 'react';

import { ContainerWithStyles } from './Container';

import { APIPlaygroundProps } from './types';

export const APIPlayground = (props: APIPlaygroundProps) => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isMounted) {
    return <ContainerWithStyles {...props} />;
  }

  return null;
};
