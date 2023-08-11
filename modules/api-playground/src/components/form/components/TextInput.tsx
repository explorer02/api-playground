//lib
import { ChangeEvent, memo, useCallback } from 'react';

//components
import { Input } from '@/spaceweb/input';
import { FormControl } from './FormControl';

//hooks
import { useFormField } from '../hooks/useFormField';

//types
import { FormFieldComponentProps } from '../types';

const TextInput = ({ id, label, onAction, error, readOnly, required, value, placeholder }: FormFieldComponentProps) => {
  const { onBlur, onChange } = useFormField(id, onAction);

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      onChange(ev.target.value);
    },
    [onChange]
  );

  return (
    <FormControl onBlur={onBlur} label={label} required={required} error={error}>
      <Input
        onChange={handleChange}
        error={!!error}
        value={value}
        placeholder={placeholder ?? label}
        disabled={readOnly}
      />
    </FormControl>
  );
};

const MemoizedTextInput = memo(TextInput);

export { MemoizedTextInput as TextInput };
