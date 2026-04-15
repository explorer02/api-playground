import { useCallback, useEffect } from 'react';
import { OnMount } from '@monaco-editor/react';

import { Snippet } from '~/components/snippet';
import { ConnectionBar } from '~/shared/connectionBar/ConnectionBar';

import { useGqlSubscription } from './hooks/useGqlSubscription';
import { useMonacoMount } from '~/hooks/useMonacoMount';

import { Language } from '~/constants/language';

import { GqlSubscriptionConfig } from '~/types';
import { STATUS_COLORS, formatDuration } from '~/utils/connectionUtils';
import { ConnectionStatus, SubscriptionStats } from './types';

const StatsBar = ({
  connectionStatus,
  stats,
}: {
  connectionStatus: ConnectionStatus;
  stats: SubscriptionStats | null;
}) => {
  if (!stats && connectionStatus === 'disconnected') return null;

  return (
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
          <span>{stats.messagesReceived} messages</span>
          <span>|</span>
          <span>{formatDuration(stats.connectionDuration)}</span>
        </>
      ) : null}
    </div>
  );
};

export const GqlSubscription = ({ config }: { config: GqlSubscriptionConfig }) => {
  const { wsUrl, setWsUrl, defaultQuery, defaultVariables, events, connectionStatus, stats, connect, disconnect } =
    useGqlSubscription({
      defaultWsUrl: config.wsUrl,
      defaultQuery: config.query,
      defaultVariables: config.variables,
    });

  const { editorRef: queryEditorRef, onMount: onQueryMountBase } = useMonacoMount();
  const { editorRef: variableEditorRef, onMount: onVariableMountBase } = useMonacoMount();
  const { editorRef: outputEditorRef, onMount: onOutputMount } = useMonacoMount();

  const onQueryMount = useCallback<OnMount>(
    (editor, monaco) => {
      onQueryMountBase(editor, monaco);
      if (defaultQuery) editor.setValue(defaultQuery);
    },
    [onQueryMountBase, defaultQuery]
  );

  const onVariableMount = useCallback<OnMount>(
    (editor, monaco) => {
      onVariableMountBase(editor, monaco);
      if (defaultVariables) editor.setValue(defaultVariables);
    },
    [onVariableMountBase, defaultVariables]
  );

  const handleConnect = useCallback(() => {
    const query = queryEditorRef.current?.getValue() ?? '';
    const variables = variableEditorRef.current?.getValue() ?? '';
    connect(query, variables);
  }, [queryEditorRef, variableEditorRef, connect]);

  // Auto-scroll output on new events
  useEffect(() => {
    if (outputEditorRef.current) {
      outputEditorRef.current.setValue(events);
      const model = outputEditorRef.current.getModel();
      if (model) {
        outputEditorRef.current.revealLine(model.getLineCount());
      }
    }
  }, [events, outputEditorRef]);

  return (
    <div className="h-full flex gap-4">
      <div className="h-full flex flex-col gap-4 flex-1">
        <ConnectionBar
          url={wsUrl}
          setUrl={setWsUrl}
          connectionStatus={connectionStatus}
          onConnect={handleConnect}
          onDisconnect={disconnect}
          placeholder="Enter WebSocket URL (wss://...)"
        />
        <Snippet
          title="Subscription"
          className="flex-1 flex-grow-2"
          editorProps={{
            onMount: onQueryMount,
            language: Language.GRAPHQL,
          }}
        />
        <Snippet
          title="Variables"
          className="flex-1"
          editorProps={{
            onMount: onVariableMount,
            language: Language.JSON,
          }}
        />
      </div>
      <div className="flex-1 relative">
        <Snippet
          title="Events"
          className="h-full"
          editorProps={{
            onMount: onOutputMount,
            readOnly: true,
            language: Language.JSON,
          }}
        />
        <StatsBar connectionStatus={connectionStatus} stats={stats} />
      </div>
    </div>
  );
};
