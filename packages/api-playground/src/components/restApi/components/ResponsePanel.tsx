//lib
import { useMemo } from 'react';

//components
import { Snippet } from '~/components/snippet';

//hooks
import { useMonacoMount } from '~/hooks/useMonacoMount';

//constants
import { Language } from '~/constants/language';

//types
import type { RestApiStats } from '../types';
import type { OnMount } from '@monaco-editor/react';
import type { MutableRefObject } from 'react';
import type { MonacoEditorType } from '~/monaco';

type Props = {
  response: string;
  loading: boolean;
  stats: RestApiStats | null;
  responseEditorRef: MutableRefObject<MonacoEditorType | undefined>;
  onResponseMount: OnMount;
};

export const ResponsePanel = ({ response, loading, stats, responseEditorRef, onResponseMount }: Props) => {
  useMemo(() => {
    responseEditorRef.current?.setValue(response);
  }, [response, responseEditorRef]);

  return (
    <div className="flex-1 relative">
      <Snippet
        title="Response"
        className="h-full"
        editorProps={{
          onMount: onResponseMount,
          readOnly: true,
          language: Language.JSON,
        }}
        loading={loading}
      />
      {stats ? (
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-1 expr-ui-02 border-0 border-t-1 border-solid expr-border-03 flex gap-3 expr-text-03"
          style={{ fontSize: '12px', zIndex: 1 }}
        >
          <span>
            {stats.status} {stats.statusText}
          </span>
          <span>|</span>
          <span>{stats.duration}ms</span>
        </div>
      ) : null}
    </div>
  );
};
