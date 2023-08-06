//lib
import { memo, useMemo } from 'react';

//components
import { Snippet } from './snippet';

//utils
import { prettifyJSON } from '@/utils/prettifyJSON';

//types
import { StaticGameConfig } from '../types';

type Props = {
  config: StaticGameConfig;
};

const StaticDataViewer = ({ config }: Props) => {
  const { data, title, language, readOnly } = config;

  const stringifiedData = useMemo(() => prettifyJSON(data), [data]);

  const editorProps = useMemo(
    () => ({ value: stringifiedData, readOnly, language }),
    [language, readOnly, stringifiedData]
  );

  return <Snippet editorProps={editorProps} title={title} />;
};

const MemoizedStaticDataViewer = memo(StaticDataViewer);

export { MemoizedStaticDataViewer as StaticDataViewer };
