import { MonacoEditorOptions } from '@/monaco';

const DEFAULT_CONFIG: MonacoEditorOptions = {
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
  autoIndent: 'full',
  minimap: { enabled: false },
};

export const getMonacoConfig = ({
  readOnly,
  darkMode,
}: {
  readOnly?: boolean;
  darkMode?: boolean;
}): MonacoEditorOptions => {
  return {
    ...DEFAULT_CONFIG,
    ...(readOnly ? { domReadOnly: true, readOnly: true } : undefined),
    ...(darkMode ? { theme: 'vs-dark' } : undefined),
  };
};
