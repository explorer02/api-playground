//lib
import { memo, useMemo } from 'react';

//components
import MonacoEditor, { EditorProps as MonacoEditorProps } from '@monaco-editor/react';
import { Box } from '@sprinklrjs/spaceweb/box';
import { Typography } from '@sprinklrjs/spaceweb/typography';
import { RightActions } from './components/RightActions';
import { Tabs } from './components/Tabs';
import { Loader } from '@sprinklrjs/spaceweb/loader';

//hooks
import { useMonacoActions } from './useMonacoActions';

//utils
import { getMonacoConfig } from './utils';

//types
import { ClassName } from '@sprinklrjs/spaceweb';
import { Action, Tab } from './types';

type EditorProps = Pick<MonacoEditorProps, 'onMount' | 'onChange' | 'language'> & {
  readOnly?: boolean;
};

type Props = {
  title: string;
  className?: ClassName;

  tabs?: Tab[];
  selectedTabIdx?: number;
  onTabClick?: (idx: number) => void;

  actions?: Action[];
  onActionClick?: (action: string) => void;

  errors?: boolean;

  editorProps?: EditorProps;

  loading?: boolean;
};

const FullSizeLoader = () => (
  <Box className="absolute inset-0 flex items-center justify-center">
    <Loader size={8} />
  </Box>
);

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
  } = useMonacoActions({ title, onActionClick, onParentMount: editorProps?.onMount });

  const rightActions = useMemo(
    () => [...(_actions ?? []), ...actions].sort((a1, a2) => (a1.type === 'cta' ? 1 : -1)),
    [_actions, actions]
  );

  return (
    <Box
      className={[
        'h-full w-full flex flex-col p-3 border-1 border-solid rounded-8 spr-ui-01',
        errors ? ({ theme }) => ({ borderColor: theme.spr.supportError }) : 'spr-border-03',
        className,
      ]}
    >
      <Box className="flex-none flex px-3 pb-2 gap-2 items-center border-0 border-b-1 border-solid spr-border-03 -mx-4 px-4">
        <Typography variant="h5" className="flex-1 ml-1">
          {title}
        </Typography>

        {tabs && onTabClick ? (
          <Box className="flex-1">
            <Tabs tabs={tabs} selectedTabIdx={selectedTabIdx} onTabClick={onTabClick} />
          </Box>
        ) : null}

        <RightActions className="flex-1" onActionClick={handleActionClick} actions={rightActions} loading={loading} />
      </Box>
      <Box className="flex-1 relative">
        <MonacoEditor
          {...editorProps}
          language={editorProps?.language ?? 'json'}
          options={monacoConfig}
          onMount={onMount}
          key={selectedTabIdx}
          loading={<FullSizeLoader />}
        />
        {loading ? <FullSizeLoader /> : null}
      </Box>
    </Box>
  );
};

const MemoizedSnippet = memo(Snippet);

export { MemoizedSnippet as Snippet };
