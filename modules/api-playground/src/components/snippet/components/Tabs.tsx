//lib
import { useCallback } from 'react';

//components
import { ButtonGroup } from '@sprinklrjs/spaceweb/button-group';
import { Button } from '@sprinklrjs/spaceweb/button';

//types
import { ClassName } from '@sprinklrjs/spaceweb';
import { Tab } from '../types';

type Props = {
  tabs: Tab[];
  selectedTabIdx?: number;
  onTabClick: (idx: number) => void;
  className?: ClassName;
};

export const Tabs = ({ tabs, selectedTabIdx = 0, onTabClick, className }: Props): JSX.Element => {
  const onTabSwitch = useCallback(
    (ev: any, idx: number) => {
      onTabClick(idx);
    },
    [onTabClick]
  );

  return (
    <ButtonGroup className={className} selected={selectedTabIdx} onClick={onTabSwitch}>
      {tabs.map(tab => (
        <Button key={tab.id}>{tab.label}</Button>
      ))}
    </ButtonGroup>
  );
};
