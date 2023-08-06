//lib
import { useCallback, useMemo, useRef, useState } from 'react';
import { VscSync } from 'react-icons/vsc';
import * as monaco from 'monaco-editor';

//hooks
import { useSnackbar } from '@/context/SnackbarContext';

//utils
import { getExpandedData } from './utils';
import { prettifyJSON } from '@/utils/prettifyJSON';

//types
import { Tab, Action } from 'components/snippet/types';
import { CacheViewerConfig } from 'types';

const TABS = [
  { id: 'graph', label: 'Graph' },
  { id: 'expanded', label: 'Expanded' },
];

enum ActionType {
  REFRESH = 'REFRESH',
  UPDATE = 'UPDATE',
}

const REFRESH_ACTION: Action = {
  id: ActionType.REFRESH,
  label: 'Refresh',
  Icon: VscSync,
  type: 'icon',
};

const UPDATE_CACHE_ACTION: Action = {
  id: ActionType.UPDATE,
  label: 'Update',
  type: 'cta',
};

type Params = {
  config: CacheViewerConfig;
};
type ReturnType = {
  data: string;

  tabs: Tab[];
  selectedTabIdx: number;
  onTabClick: (idx: number) => void;

  actions: Action[];

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

  const stringifiedData = useMemo(() => prettifyJSON(client.cache.extract()), [client.cache, count]);

  const expandedData = useMemo(() => getExpandedData(client), [client, count]);
  const expandedStringifiedData = useMemo(() => prettifyJSON(expandedData), [expandedData]);

  const tabData = [stringifiedData, expandedStringifiedData];

  const onActionClick = useCallback(
    (action: string) => {
      if (action === ActionType.REFRESH) {
        setCount(c => c + 1);
      } else if (action === ActionType.UPDATE) {
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

  const actions = useMemo(
    () => (readOnly && !tabIdx ? [REFRESH_ACTION] : [REFRESH_ACTION, UPDATE_CACHE_ACTION]),
    [readOnly, tabIdx]
  );

  return {
    data: tabData[tabIdx],

    selectedTabIdx: tabIdx,
    onTabClick: setTabIdx,
    tabs: TABS,

    actions,
    onActionClick,

    onMount,
  };
};
