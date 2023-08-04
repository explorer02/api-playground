import { useMemo } from 'react';
import { StaticGameConfig } from '../types';
import { Snippet } from './snippet';

type Props = {
  config: StaticGameConfig;
};

export const StaticDataViewer = ({ config }: Props) => {
  const stringifiedData = useMemo(() => JSON.stringify(config.data, null, 4), [config.data]);

  return <Snippet content={stringifiedData} title={config.title} readOnly={ config.readOnly} />;
};
