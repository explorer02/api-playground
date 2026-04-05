//lib
import { useCallback, useMemo } from 'react';
import { VscSend, VscAdd, VscClose } from 'react-icons/vsc';

//components
import { Snippet } from '~/components/snippet';
import { Button } from '~/shared/button/Button';
import { Input } from '~/shared/input';
import { Select } from '~/shared/select/Select';
import { Typography } from '~/shared/typography';

//hooks
import { useRestApi } from './hooks/useRestApi';
import { useMonacoMount } from '~/hooks/useMonacoMount';

//constants
import { Language } from '~/constants/language';

//types
import { RestApiConfig } from '~/types';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
const HTTP_METHOD_OPTIONS = HTTP_METHODS.map(m => ({ id: m, label: m }));

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

  // Update response editor when response changes
  useMemo(() => {
    responseEditorRef.current?.setValue(response);
  }, [response, responseEditorRef]);

  return (
    <div className="h-full flex gap-4">
      {/* Left side: controls */}
      <div className="h-full flex flex-col gap-4 flex-1">
        {/* Method selector + URL + Execute */}
        <div className="flex-none flex gap-3 items-center">
          <div style={{ width: '120px' }}>
            <Select
              size="xs"
              options={HTTP_METHOD_OPTIONS}
              value={HTTP_METHOD_OPTIONS.find(o => o.id === method)}
              onChange={o => setMethod(o.id as typeof method)}
            />
          </div>
          <Input className="flex-1" placeholder="Enter URL" value={url} onChange={e => setUrl(e.target.value)} />
          <Button className="flex-none" size="xs" tooltipContent="Execute" onClick={execute} icon>
            <VscSend />
          </Button>
        </div>

        {/* Headers editor */}
        <div className="flex-none flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Typography variant="h6">Headers</Typography>
            <Button size="xs" variant="secondary" onClick={addHeader} icon tooltipContent="Add Header">
              <VscAdd size={14} />
            </Button>
          </div>
          {headers.map((header, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                size="xs"
                placeholder="Key"
                value={header.key}
                onChange={e => updateHeader(index, 'key', e.target.value)}
                className="flex-1"
              />
              <Input
                size="xs"
                placeholder="Value"
                value={header.value}
                onChange={e => updateHeader(index, 'value', e.target.value)}
                className="flex-1"
              />
              <Button size="xs" variant="secondary" onClick={() => removeHeader(index)} icon tooltipContent="Remove">
                <VscClose size={14} />
              </Button>
            </div>
          ))}
        </div>

        {/* Body editor */}
        <Snippet
          title="Body"
          className="flex-1"
          editorProps={{
            onChange: onBodyChange,
            language: Language.JSON,
          }}
        />
      </div>

      {/* Right side: response viewer */}
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
            className="absolute bottom-0 left-0 right-0 px-3 py-1 spr-ui-02 border-0 border-t-1 border-solid spr-border-03 flex gap-3 spr-text-03"
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
    </div>
  );
};
