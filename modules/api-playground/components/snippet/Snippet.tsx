//lib
import { useMemo, useRef } from 'react';

//components
import MonacoEditor from '@monaco-editor/react';
import { Box } from '@sprinklrjs/spaceweb/box';
import { Typography } from '@sprinklrjs/spaceweb/typography';
import { IconButton } from '@sprinklrjs/spaceweb/button';

//hooks
import { useMonacoActions } from './useMonacoActions';

//utils
import { getMonacoConfig } from './utils';

//types
import { ClassName } from '@sprinklrjs/spaceweb';

type Props = {
  title: string;
  subTitle?: string;
  content: string;
  className?: ClassName;
  readOnly?: boolean;
  language?: string;
};

export const Snippet = ({ title, subTitle, content, className, readOnly, language }: Props): JSX.Element => {
  const contentRef = useRef(content);

  const monacoConfig = useMemo(() => getMonacoConfig({ readOnly }), [readOnly]);

  const { onMount, onActionClick, actions } = useMonacoActions({ initialContent: content, title });

  return (
    <Box className={['h-full w-full flex flex-col p-3 border-1 border-solid rounded-8 spr-border-03', className]}>
      <Box className="flex-none flex px-3 pb-2 gap-2 items-center border-0 border-b-1 border-solid spr-border-03 -mx-4 px-4">
        <Box className="flex-1 ml-1">
          <Typography variant="h5">{title}</Typography>
          <Typography>{subTitle}</Typography>
        </Box>
        {actions.map(({ Icon, label, id }) => (
          <IconButton
            key={id}
            tooltipContent={label}
            bordered
            shape="square"
            size="xs"
            onClick={onActionClick}
            data-id={id}
          >
            <Icon size={16} stroke="black" strokeWidth={1} />
          </IconButton>
        ))}
      </Box>
      <Box className="flex-1">
        <MonacoEditor
          value={contentRef.current}
          options={monacoConfig}
          language={language ?? 'json'}
          onMount={onMount}
        />
      </Box>
    </Box>
  );
};
