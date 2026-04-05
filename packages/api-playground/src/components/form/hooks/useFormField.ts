//lib
import { useCallback } from 'react';

//constants
import { ActionType, OnFormAction } from '../actionType';

type ReturnType = {
  onBlur: () => void;
  onChange: (value: any) => void;
};

export const useFormField = (fieldId: string, onAction: OnFormAction): ReturnType => {
  const onBlur = useCallback(() => {
    onAction({ type: ActionType.ON_FIELD_BLUR, payload: { fieldId } });
  }, [fieldId, onAction]);

  const onChange = useCallback(
    (value: any) => {
      onAction({ type: ActionType.ON_CHANGE, payload: { fieldId, value } });
    },
    [fieldId, onAction]
  );

  return { onBlur, onChange };
};
