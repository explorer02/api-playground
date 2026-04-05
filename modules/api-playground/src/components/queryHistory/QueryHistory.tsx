import { memo, useState, useRef } from 'react';
import { VscHistory, VscTrash } from 'react-icons/vsc';

import { Typography } from '@/shared/typography';
import { Button } from '@/shared/button/Button';
import { HistoryEntry } from './types';

type Props = {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
};

const formatTime = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const truncate = (text: string, maxLen: number) => (text.length > maxLen ? text.slice(0, maxLen) + '...' : text);

const QueryHistory = ({ entries, onSelect, onClear }: Props) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (entries.length === 0) return null;

  return (
    <div className="relative" ref={containerRef}>
      <Button size="xs" variant="secondary" icon tooltipContent="Query History" onClick={() => setOpen(o => !o)}>
        <VscHistory size={14} />
      </Button>
      {open && (
        <div
          className="absolute top-full right-0 mt-1 border-1 border-solid spr-border-03 rounded-8 spr-ui-01 overflow-hidden"
          style={{ width: '320px', maxHeight: '300px', overflowY: 'auto', zIndex: 10 }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-0 border-b-1 border-solid spr-border-03">
            <Typography variant="h6">History</Typography>
            <Button size="xs" variant="secondary" icon tooltipContent="Clear History" onClick={onClear}>
              <VscTrash size={16} />
            </Button>
          </div>
          {entries.map(entry => (
            <div
              key={entry.id}
              className="px-3 py-2 cursor-pointer hover-spr-ui-02 border-0 border-b-1 border-solid spr-border-03"
              onClick={() => {
                onSelect(entry);
                setOpen(false);
              }}
            >
              <div className="flex justify-between items-center">
                <Typography variant="body-14" className="truncate" style={{ maxWidth: '220px' }}>
                  {truncate(entry.queryText, 50)}
                </Typography>
                <Typography variant="l3" className="spr-text-03 flex-none">
                  {entry.responseTimeMs}ms
                </Typography>
              </div>
              <Typography variant="l4" className="spr-text-03 mt-1">
                {formatTime(entry.timestamp)}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MemoizedQueryHistory = memo(QueryHistory);
export { MemoizedQueryHistory as QueryHistory };
