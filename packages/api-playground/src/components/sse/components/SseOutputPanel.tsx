import { useEffect } from 'react';

import { Snippet } from '~/components/snippet';
import { Language } from '~/constants/language';

import type { MutableRefObject } from 'react';
import type { OnMount } from '@monaco-editor/react';
import type { MonacoEditorType } from '~/monaco';
import type { ConnectionStatus, SseStats } from '../types';
import { STATUS_COLORS, formatDuration } from '~/utils/connectionUtils';

type Props = {
  events: string;
  connectionStatus: ConnectionStatus;
  stats: SseStats | null;
  editorRef: MutableRefObject<MonacoEditorType | undefined>;
  onMount: OnMount;
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
};

export const SseOutputPanel = ({ events, connectionStatus, stats, editorRef, onMount }: Props) => {
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(events);
      const model = editorRef.current.getModel();
      if (model) {
        editorRef.current.revealLine(model.getLineCount());
      }
    }
  }, [events, editorRef]);

  return (
    <div className="flex-1 relative">
      <Snippet
        title="Events"
        className="h-full"
        editorProps={{
          onMount,
          readOnly: true,
          language: Language.JSON,
        }}
      />
      {stats || connectionStatus !== 'disconnected' ? (
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-1 expr-ui-02 border-0 border-t-1 border-solid expr-border-03 flex gap-3 items-center expr-text-03"
          style={{ fontSize: '12px', zIndex: 1 }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: STATUS_COLORS[connectionStatus],
                display: 'inline-block',
              }}
            />
            {connectionStatus}
          </span>
          {stats ? (
            <>
              <span>|</span>
              <span>{stats.eventsReceived} events</span>
              <span>|</span>
              <span>{formatBytes(stats.totalBytes)}</span>
              <span>|</span>
              <span>{formatDuration(stats.connectionDuration)}</span>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
