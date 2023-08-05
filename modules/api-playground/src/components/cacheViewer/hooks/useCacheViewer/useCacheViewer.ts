//lib
import { useCallback, useMemo, useState } from 'react';
import { VscSync } from 'react-icons/vsc';

//utils
import { getExpandedData } from './utils';

//types
import { Tab, Action } from 'components/snippet/types';
import { CacheViewerConfig } from 'types';

type Params = {
  config: CacheViewerConfig;
};

const TABS = [
  { id: 'graph', label: 'Graph' },
  { id: 'expanded', label: 'Expanded' },
];

const ACTIONS = {
  REFRESH: 'REFRESH',
} as const;

const RIGHT_ACTIONS: Action[] = [
  {
    id: ACTIONS.REFRESH,
    label: 'Refresh',
    Icon: VscSync,
  },
];

export const useCacheViewer = ({
  config,
}: Params): {
  tabs: Tab[];
  selectedTabIdx: number;
  onTabClick: (idx: number) => void;
  data: string;
  rightActions: Action[];
  onActionClick: (action: string) => void;
} => {
  const { client } = config;

  const [tabIdx, setTabIdx] = useState(0);
  const [count, setCount] = useState(0);

  const stringifiedData = useMemo(() => JSON.stringify(client.cache.extract(), null, 4), [client.cache, count]);

  const expandedData = useMemo(() => getExpandedData(client), [client, count]);
  const expandedStringifiedData = useMemo(() => JSON.stringify(expandedData, null, 4), [expandedData]);

  const tabData = [stringifiedData, expandedStringifiedData];

  const onActionClick = useCallback((action: string) => {
    if (action === ACTIONS.REFRESH) {
      setCount(c => c + 1);
    }
  }, []);

  return {
    selectedTabIdx: tabIdx,
    onTabClick: setTabIdx,
    tabs: TABS,
    data: tabData[tabIdx],
    rightActions: RIGHT_ACTIONS,
    onActionClick,
  };
};
