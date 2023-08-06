import { APIPlaygroundProps } from '@/types';
import { ContainerWithStyles } from './ContainerWithStyles';

import { useIsClientSide } from '@/hooks/useIsClientSide';

export const APIPlayground = (props: APIPlaygroundProps) => {
  const isClientSide = useIsClientSide();
  return isClientSide ? <ContainerWithStyles {...props} /> : null;
};
