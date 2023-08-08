//lib
import { ChangeEvent, memo, useCallback } from 'react';

//components
import { Input } from '@sprinklrjs/spaceweb/input';
import { FormControl } from './FormControl';

//hooks
import { useFormField } from '../hooks/useFormField';
import { FormFieldComponentProps } from '../types';

const NumberInput = ({
  id,
  label,
  onAction,
  error,
  readOnly,
  required,
  value,
  placeholder,
}: FormFieldComponentProps<number>) => {
  const { onBlur, onChange } = useFormField(id, onAction);

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      if (ev.target.value) {
        onChange(Number(ev.target.value));
      } else {
        onChange(undefined);
      }
    },
    [onChange]
  );

  return (
    <FormControl onBlur={onBlur} label={label} required={required} error={error}>
      <Input
        type="number"
        onChange={handleChange}
        intent={error ? 'error' : 'default'}
        value={value}
        placeholder={placeholder ?? label}
        disabled={readOnly}
      />
    </FormControl>
  );
};

const MemoizedNumberInput = memo(NumberInput);

export { MemoizedNumberInput as NumberInput };
