import { APIPlayground } from './APIPlayground';

import { useIsClientSide } from '@/hooks/useIsClientSide';

import { APIPlaygroundProps } from '@/types';

const Container = (props: APIPlaygroundProps) => {
  const isClientSide = useIsClientSide();
  return isClientSide ? <APIPlayground {...props} /> : null;
};

export { Container as APIPlayground };
