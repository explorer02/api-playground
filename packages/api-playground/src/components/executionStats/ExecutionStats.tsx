import { memo } from 'react';
import { ExecutionStatsData } from './types';

type Props = {
  stats: ExecutionStatsData;
};

const ExecutionStats = ({ stats }: Props) => (
  <div
    className="absolute bottom-0 left-0 right-0 px-3 py-1 spr-ui-02 border-0 border-t-1 border-solid spr-border-03 flex gap-3 spr-text-03"
    style={{ fontSize: '12px', zIndex: 1 }}
  >
    <span>{stats.responseTimeMs}ms</span>
    <span>|</span>
    <span>{(stats.payloadSizeBytes / 1024).toFixed(1)}KB</span>
  </div>
);

const MemoizedExecutionStats = memo(ExecutionStats);
export { MemoizedExecutionStats as ExecutionStats };
