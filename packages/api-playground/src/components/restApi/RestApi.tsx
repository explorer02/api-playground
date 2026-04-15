//lib
import { useCallback } from 'react';
import { useCopyToClipboard } from 'react-use';

//components
import { Snippet } from '~/components/snippet';
import { RequestBar } from './components/RequestBar';
import { HeadersEditor } from './components/HeadersEditor';
import { ResponsePanel } from './components/ResponsePanel';
import { VscTerminal } from 'react-icons/vsc';

//hooks
import { useRestApi } from './hooks/useRestApi';
import { useMonacoMount } from '~/hooks/useMonacoMount';

//utils
import { generateCurl } from '~/utils/generateCurl';

//constants
import { Language } from '~/constants/language';

//types
import { RestApiConfig } from '~/types';
import type { Action } from '~/components/snippet/types';

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

  const [, copyToClipboard] = useCopyToClipboard();

  const curlAction: Action = { id: 'CURL', label: 'Copy as cURL', Icon: VscTerminal };

  const handleCurlAction = useCallback(
    (action: string) => {
      if (action !== 'CURL') return;
      const headerObj: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key.trim()) headerObj[h.key.trim()] = h.value;
      });
      const curl = generateCurl({ url, method, headers: headerObj, body: method !== 'GET' ? body : undefined });
      copyToClipboard(curl);
    },
    [url, method, headers, body, copyToClipboard]
  );

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
        actions={[curlAction]}
        onActionClick={handleCurlAction}
      />
    </div>
  );
};
