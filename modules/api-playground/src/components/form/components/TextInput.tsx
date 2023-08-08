//lib
import { ChangeEvent, memo, useCallback } from 'react';

//components
import { Input } from '@sprinklrjs/spaceweb/input';
import { FormControl } from './FormControl';

//hooks
import { useFormField } from '../hooks/useFormField';
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
        intent={error ? 'error' : 'default'}
        value={value}
        placeholder={placeholder ?? label}
        disabled={readOnly}
      />
    </FormControl>
  );
};

const MemoizedTextInput = memo(TextInput);

export { MemoizedTextInput as TextInput };
