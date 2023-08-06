import { ContainerWithoutStyles } from './ContainerWithoutStyles';

import { useIsClientSide } from '@/hooks/useIsClientSide';

import { APIPlaygroundProps } from '@/types';

export const APIPlayground = (props: APIPlaygroundProps) => {
  const isClientSide = useIsClientSide();

  return isClientSide ? <ContainerWithoutStyles {...props} /> : null;
};
