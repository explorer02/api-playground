//components
import { Snippet } from '../snippet';

//hooks
import { useCacheViewer } from './hooks/useCacheViewer';

//types
import { CacheViewerConfig } from 'types';

type Props = {
  config: CacheViewerConfig;
};

export const CacheViewer = ({ config }: Props) => {
  const { title, readOnly } = config;

  const { data, onTabClick, selectedTabIdx, tabs, onActionClick, rightActions } = useCacheViewer({ config });

  return (
    <Snippet
      content={data}
      title={title}
      readOnly={readOnly}
      tabs={tabs}
      selectedTabIdx={selectedTabIdx}
      onTabClick={onTabClick}
      rightActions={rightActions}
      onActionClick={onActionClick}
    />
  );
};
