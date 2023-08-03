//lib
import { useCallback, useRef } from 'react';
import { editor } from 'monaco-editor';
import { useCopyToClipboard } from 'react-use';

//components
import MonacoEditor from '@monaco-editor/react';
import { Box } from '@sprinklrjs/spaceweb/box';
import { Typography } from '@sprinklrjs/spaceweb/typography';
import { IconButton } from '@sprinklrjs/spaceweb/button';
import { RiFileCopyFill } from 'react-icons/ri';
import { LiaDownloadSolid } from 'react-icons/lia';

//utils
import { downloadJSON } from 'modules/api-playground/utils/downloadJSON';

//types
import { ClassName } from '@sprinklrjs/spaceweb';

const EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  scrollbar: {
    verticalScrollbarSize: 8,
    useShadows: false,
  },
  glyphMargin: false,
  folding: true,
  lineDecorationsWidth: 8,
  lineNumbersMinChars: 3,
  automaticLayout: true,
  renderLineHighlight: 'line',
  wrappingStrategy: 'advanced',
  fontSize: 14,
  formatOnType: true,
  formatOnPaste: true,
  padding: {
    top: 4,
    bottom: 4,
  },

  showFoldingControls: 'always',
  foldingHighlight: true,
  contextmenu: true,
  // theme: 'vs-dark',
  // domReadOnly: true,
  // readOnly: true,
  autoIndent: 'full',
  minimap: { enabled: false },
};

export const Snippet = ({
  title,
  subTitle,
  content,
  className,
}: {
  title: string;
  subTitle?: string;
  content: string;
  className?: ClassName;
}): JSX.Element => {
  const contentRef = useRef(content);

  const [_, copyToClipboard] = useCopyToClipboard();
  const onCopy = useCallback((): void => copyToClipboard(content.trim()), [copyToClipboard, content]);

  return (
    <Box className={['h-full w-full flex flex-col p-3 border-1 border-solid rounded-8 spr-border-03', className]}>
      <Box className="flex-none flex px-3 pb-2 gap-2 items-center border-0 border-b-1 border-solid spr-border-03 -mx-4 px-4">
        <Box className="flex-1 ml-1">
          <Typography variant="h5">{title}</Typography>
          <Typography>{subTitle}</Typography>
        </Box>
        <IconButton tooltipContent="Copy" bordered shape="square" size="xs" onClick={onCopy}>
          <RiFileCopyFill size={16} />
        </IconButton>
        <IconButton
          tooltipContent="Download"
          bordered
          shape="square"
          size="xs"
          onClick={() => downloadJSON(contentRef.current, 'snippet.json')}
        >
          <LiaDownloadSolid size={16} stroke="black" strokeWidth={1} />
        </IconButton>
      </Box>
      <Box className="flex-1">
        <MonacoEditor
          value={contentRef.current}
          options={EDITOR_OPTIONS}
          language="json"
          onChange={val => {
            contentRef.current = val ?? '';
          }}
        />
      </Box>
    </Box>
  );
};
