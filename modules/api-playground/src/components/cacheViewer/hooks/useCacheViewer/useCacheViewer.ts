//lib
import { useCallback, useMemo, useRef, useState } from 'react';
import { VscSync } from 'react-icons/vsc';
import * as monaco from 'monaco-editor';

//hooks
import { useSnackbar } from '@/context/SnackbarContext';

//utils
import { getExpandedData } from './utils';

//types
import { Tab, Action } from 'components/snippet/types';
import { CacheViewerConfig } from 'types';

const TABS = [
  { id: 'graph', label: 'Graph' },
  { id: 'expanded', label: 'Expanded' },
];

const ACTIONS = {
  REFRESH: 'REFRESH',
  UPDATE: 'UPDATE',
} as const;

const RIGHT_ACTIONS: Action[] = [
  {
    id: ACTIONS.REFRESH,
    label: 'Refresh',
    Icon: VscSync,
  },
];

const CTA_ACTIONS: Action[] = [
  {
    id: ACTIONS.UPDATE,
    label: 'Update',
    cta: true,
  },
];

type Params = {
  config: CacheViewerConfig;
};
type ReturnType = {
  tabs: Tab[];
  selectedTabIdx: number;
  onTabClick: (idx: number) => void;
  data: string;
  rightActions: Action[];
  ctaActions: Action[] | undefined;
  onActionClick: (action: string) => void;
  onMount: (mEditor: monaco.editor.IStandaloneCodeEditor) => void;
};

export const useCacheViewer = ({ config }: Params): ReturnType => {
  const { client, readOnly } = config;

  const [tabIdx, setTabIdx] = useState(0);
  const [count, setCount] = useState(0);

  const { onError, onSuccess } = useSnackbar();

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onMount = useCallback((mEditor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = mEditor;
  }, []);

  const stringifiedData = useMemo(() => JSON.stringify(client.cache.extract(), null, 4), [client.cache, count]);

  const expandedData = useMemo(() => getExpandedData(client), [client, count]);
  const expandedStringifiedData = useMemo(() => JSON.stringify(expandedData, null, 4), [expandedData]);

  const tabData = [stringifiedData, expandedStringifiedData];

  const onActionClick = useCallback(
    (action: string) => {
      if (action === ACTIONS.REFRESH) {
        setCount(c => c + 1);
      } else if (action === ACTIONS.UPDATE) {
        try {
          const parsedCache = JSON.parse(editorRef.current?.getValue() ?? '');
          client.cache.restore(parsedCache);
          onSuccess('Cache updated successfully...');
        } catch (e: any) {
          console.error(e);
          onError(e.message ?? 'Something went wrong...');
        }
      }
    },
    [client.cache, onError, onSuccess]
  );

  return {
    selectedTabIdx: tabIdx,
    onTabClick: setTabIdx,
    tabs: TABS,
    data: tabData[tabIdx],
    rightActions: RIGHT_ACTIONS,
    ctaActions: readOnly ? undefined : CTA_ACTIONS,
    onActionClick,
    onMount,
  };
};
