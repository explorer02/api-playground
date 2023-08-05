//lib
import { useMemo } from 'react';

//components
import MonacoEditor from '@monaco-editor/react';
import { Box } from '@sprinklrjs/spaceweb/box';
import { Typography } from '@sprinklrjs/spaceweb/typography';
import { RightActions } from './components/RightActions';
import { Tabs } from './components/Tabs';

//hooks
import { useMonacoActions } from './useMonacoActions';

//utils
import { getMonacoConfig } from './utils';

//types
import { ClassName } from '@sprinklrjs/spaceweb';
import { Action, Tab } from './types';

type Props = {
  title: string;
  content: string;
  className?: ClassName;
  readOnly?: boolean;
  language?: string;

  tabs?: Tab[];
  selectedTabIdx?: number;
  onTabClick?: (idx: number) => void;

  rightActions?: Action[];
  onActionClick?: (action: string) => void;
};

export const Snippet = ({
  title,
  content,
  className,
  readOnly,
  language,
  tabs,
  selectedTabIdx,
  onTabClick,

  rightActions: _rightActions,
  onActionClick,
}: Props): JSX.Element => {
  const monacoConfig = useMemo(() => getMonacoConfig({ readOnly }), [readOnly]);

  const { onMount, onActionClick: handleActionClick, actions } = useMonacoActions({ title, onActionClick });

  const rightActions = useMemo(() => [...(_rightActions ?? []), ...actions], [_rightActions, actions]);

  return (
    <Box className={['h-full w-full flex flex-col p-3 border-1 border-solid rounded-8 spr-border-03', className]}>
      <Box className="flex-none flex px-3 pb-2 gap-2 items-center border-0 border-b-1 border-solid spr-border-03 -mx-4 px-4">
        <Typography variant="h5" className="flex-1 ml-1">
          {title}
        </Typography>

        {tabs && onTabClick ? (
          <Box className="flex-1">
            <Tabs tabs={tabs} selectedTabIdx={selectedTabIdx} onTabClick={onTabClick} />
          </Box>
        ) : null}

        <RightActions className="flex-1" onActionClick={handleActionClick} actions={rightActions} />
      </Box>
      <Box className="flex-1">
        <MonacoEditor
          value={content}
          options={monacoConfig}
          language={language ?? 'json'}
          onMount={onMount}
          key={selectedTabIdx}
        />
      </Box>
    </Box>
  );
};
