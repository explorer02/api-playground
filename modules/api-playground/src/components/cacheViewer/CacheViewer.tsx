//components
import { memo, useMemo } from 'react';
import { Snippet } from '../snippet';

//hooks
import { useCacheViewer } from './hooks/useCacheViewer';

//types
import { CacheViewerConfig } from 'types';

type Props = {
  config: CacheViewerConfig;
};

const CacheViewer = ({ config }: Props) => {
  const { title, readOnly } = config;

  const { data, onTabClick, selectedTabIdx, tabs, onActionClick, actions, onMount } = useCacheViewer({
    config,
  });

  const editorProps = useMemo(() => ({ value: data, readOnly, onMount }), [data, onMount, readOnly]);

  return (
    <Snippet
      editorProps={editorProps}
      title={title}
      // ----- //
      tabs={tabs}
      selectedTabIdx={selectedTabIdx}
      onTabClick={onTabClick}
      // ----- //
      actions={actions}
      onActionClick={onActionClick}
    />
  );
};

const MemoizedCacheViewer = memo(CacheViewer);

export { MemoizedCacheViewer as CacheViewer };
