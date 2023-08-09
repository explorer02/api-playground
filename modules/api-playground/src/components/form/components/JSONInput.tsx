//lib
import { memo, useMemo, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';

//components
import { Box } from '@sprinklrjs/spaceweb/box';
import { FormControl } from './FormControl';
import { FullSizeLoader } from '@/components/snippet/components/FullSizeLoader';

//hooks
import { useFormField } from '../hooks/useFormField';
import { useValidateJSON } from '@/hooks/useValidateJSON';

//utils
import { getMonacoConfig } from '@/components/snippet/utils';

//constants
import { Language } from '@/constants/language';

//types
import { FormFieldComponentProps } from '../types';

const JSONInput = ({ id, label, onAction, error, readOnly, required, value }: FormFieldComponentProps) => {
  const { onBlur, onChange } = useFormField(id, onAction);

  const monacoConfig = useMemo(() => getMonacoConfig({ readOnly }), [readOnly]);

  const valueRef = useRef(value?.toString());

  const { errors: validationErrors, handleChange } = useValidateJSON({ onChange });

  return (
    <FormControl error={error} onBlur={onBlur} required={required} label={label}>
      <Box
        className={[
          'py-2 rounded-8 spr-ui-01 border-1 border-solid',
          validationErrors ? ({ theme }) => ({ borderColor: theme.spr.supportError }) : 'spr-border-03',
        ]}
      >
        <MonacoEditor
          language={Language.JSON}
          options={monacoConfig}
          height={300}
          loading={<FullSizeLoader />}
          onChange={handleChange}
          value={valueRef.current}
        />
      </Box>
    </FormControl>
  );
};

const MemoizedJSONInput = memo(JSONInput);

export { MemoizedJSONInput as JSONInput };
