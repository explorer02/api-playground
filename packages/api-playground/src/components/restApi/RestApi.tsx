//lib
import { useCallback } from 'react';

//components
import { Snippet } from '~/components/snippet';
import { RequestBar } from './components/RequestBar';
import { HeadersEditor } from './components/HeadersEditor';
import { ResponsePanel } from './components/ResponsePanel';

//hooks
import { useRestApi } from './hooks/useRestApi';
import { useMonacoMount } from '~/hooks/useMonacoMount';

//constants
import { Language } from '~/constants/language';

//types
import { RestApiConfig } from '~/types';

export const RestApi = ({ config }: { config: RestApiConfig }) => {
  const {
    url,
    setUrl,
    method,
    setMethod,
    headers,
    addHeader,
    removeHeader,
    updateHeader,
    body,
    setBody,
    response,
    loading,
    stats,
    execute,
  } = useRestApi({
    defaultUrl: config.defaultUrl,
    defaultMethod: config.defaultMethod,
    defaultHeaders: config.defaultHeaders,
    defaultBody: config.defaultBody,
  });

  const { editorRef: responseEditorRef, onMount: onResponseMount } = useMonacoMount();

  const onBodyChange = useCallback(
    (value?: string) => {
      setBody(value ?? '');
    },
    [setBody]
  );

  return (
    <div className="h-full flex gap-4">
      <div className="h-full flex flex-col gap-4 flex-1">
        <RequestBar method={method} setMethod={setMethod} url={url} setUrl={setUrl} execute={execute} />
        <HeadersEditor
          headers={headers}
          addHeader={addHeader}
          removeHeader={removeHeader}
          updateHeader={updateHeader}
        />
        <Snippet
          title="Body"
          className="flex-1"
          editorProps={{
            onChange: onBodyChange,
            language: Language.JSON,
          }}
        />
      </div>
      <ResponsePanel
        response={response}
        loading={loading}
        stats={stats}
        responseEditorRef={responseEditorRef}
        onResponseMount={onResponseMount}
      />
    </div>
  );
};
