import { useEffect, useState } from 'react';

import { ContainerWithStyles } from './ContainerWithStyles';

import { APIPlaygroundProps } from './types';

export const ClientOnlyContainer = (props: APIPlaygroundProps) => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isMounted) {
    return <ContainerWithStyles {...props} />;
  }

  return null;
};
