//lib
import { useCallback, useState } from 'react';
import { OnChange } from '@monaco-editor/react';

type Params = {
  onChange?: OnChange;
};

type ReturnType = {
  errors: boolean;
  handleChange: OnChange;
};

export const useValidateJSON = ({ onChange }: Params = {}): ReturnType => {
  const [errors, setErrors] = useState(false);

  const handleChange = useCallback<OnChange>(
    (content, ev) => {
      onChange?.(content, ev);
      try {
        const parsedVariables = JSON.parse(content ?? '');
        setErrors(false);
      } catch {
        setErrors(true);
      }
    },
    [onChange]
  );

  return {
    errors,
    handleChange,
  };
};
