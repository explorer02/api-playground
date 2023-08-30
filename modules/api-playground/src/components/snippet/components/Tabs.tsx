//lib
import { useCallback } from 'react';

//components
import { ButtonGroup } from '@/shared/button-group';

//types
import { Tab } from '../types';

type Props = {
  tabs: Tab[];
  selectedTabIdx?: number;
  onTabClick: (idx: number) => void;
  className?: string;
};

export const Tabs = ({ tabs, selectedTabIdx = 0, onTabClick, className }: Props): JSX.Element => {
  const onTabSwitch = useCallback(
    (idx: number) => {
      onTabClick(idx);
    },
    [onTabClick]
  );

  return (
    <ButtonGroup className={className} config={tabs} selectedIdx={selectedTabIdx} size="xs" onClick={onTabSwitch} />
  );
};
