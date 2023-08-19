//lib
import { memo, useMemo } from 'react';

//components
import MonacoEditor, { EditorProps as MonacoEditorProps } from '@monaco-editor/react';
import { Typography } from '@/spaceweb/typography';
import { RightActions } from './components/RightActions';
import { Tabs } from './components/Tabs';
import { FullSizeLoader } from './components/FullSizeLoader';

//hooks
import { useMonacoActions } from './useMonacoActions';

//utils
import { getMonacoConfig } from './utils';

//constants
import { Language } from '@/constants/language';

//types
import { Action, Tab } from './types';

type EditorProps = Pick<MonacoEditorProps, 'onMount' | 'onChange'> & {
  readOnly?: boolean;
  language?: Language;
};

type Props = {
  title: string;
  className?: string;

  tabs?: Tab[];
  selectedTabIdx?: number;
  onTabClick?: (idx: number) => void;

  actions?: Action[];
  onActionClick?: (action: string) => void;

  errors?: boolean;

  editorProps?: EditorProps;

  loading?: boolean;
};

const Snippet = ({
  title,
  className,

  tabs,
  selectedTabIdx,
  onTabClick,

  actions: _actions,
  onActionClick,

  errors,

  editorProps,

  loading,
}: Props): JSX.Element => {
  const monacoConfig = useMemo(() => getMonacoConfig({ readOnly: editorProps?.readOnly }), [editorProps?.readOnly]);

  const {
    onMount,
    onActionClick: handleActionClick,
    actions,
  } = useMonacoActions({
    title,
    onActionClick,
    onParentMount: editorProps?.onMount,
    language: editorProps?.language ?? Language.JSON,
  });

  const rightActions = useMemo(
    () => [...(_actions ?? []), ...actions].sort((a1, a2) => (a1.type === 'cta' ? 1 : -1)),
    [_actions, actions]
  );

  return (
    <div
      className={`h-full w-full flex flex-col border-solid border-1 rounded-8 spr-ui-01 ${
        errors ? 'border-error' : 'spr-border-03'
      } ${className ?? ''}`}
    >
      <div className="flex-none flex p-3 gap-2 items-center border-0 border-b-1 border-solid spr-border-03 ">
        <Typography variant="h5" className="flex-1 ml-1">
          {title}
        </Typography>

        {tabs && onTabClick ? (
          <div className="flex-1 flex justify-center">
            <Tabs tabs={tabs} selectedTabIdx={selectedTabIdx} onTabClick={onTabClick} />
          </div>
        ) : null}

        <RightActions className="flex-1" onActionClick={handleActionClick} actions={rightActions} loading={loading} />
      </div>
      <div className="flex-1 relative px-3 pb-3">
        <MonacoEditor
          {...editorProps}
          language={editorProps?.language ?? Language.JSON}
          options={monacoConfig}
          onMount={onMount}
          key={selectedTabIdx}
          loading={<FullSizeLoader />}
        />
        {loading ? <FullSizeLoader /> : null}
      </div>
    </div>
  );
};

const MemoizedSnippet = memo(Snippet);

export { MemoizedSnippet as Snippet };
