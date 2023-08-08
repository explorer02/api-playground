//lib
import { useCallback, useRef, useState } from 'react';

//constants
import { ActionType, OnFormAction } from '../actionType';

//types
import { FieldConfigMap } from '@/types';
import { FormErrors, FormValues } from '../types';

type Params = {
  fieldConfigMap: FieldConfigMap;
  validator?: (o: FormValues) => FormErrors;
  initialValues?: FormValues;
  onSubmit: (vals: FormValues) => void;
};

type ReturnType = {
  values: Record<string, string | number>;
  onAction: OnFormAction;
  errors: Record<string, string>;
};

export const useForm = ({ fieldConfigMap, validator, initialValues, onSubmit }: Params): ReturnType => {
  const [values, setValues] = useState<FormValues>(initialValues ?? {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitCountRef = useRef<number>(0);

  const defaultValidator = useCallback(
    (vals: FormValues) => {
      return Object.keys(fieldConfigMap).reduce((acc, key) => {
        const fieldConfig = fieldConfigMap[key];
        if (fieldConfig.required && !vals[key]?.toString().trim()) {
          return { ...acc, [key]: 'This field cannot be empty!!' };
        }
        return acc;
      }, {} as FormErrors);
    },
    [fieldConfigMap]
  );

  const latestValuesRef = useRef(values);
  latestValuesRef.current = values;

  const onAction = useCallback<OnFormAction>(
    action => {
      switch (action.type) {
        case ActionType.ON_FIELD_BLUR: {
          break;
        }
        case ActionType.ON_CHANGE: {
          const newVals = { ...latestValuesRef.current, [action.payload.fieldId]: action.payload.value };
          setValues(newVals);
          if (submitCountRef.current) {
            const validationErrors = (validator ?? defaultValidator)(newVals);
            setErrors(validationErrors);
          }

          break;
        }
        case ActionType.ON_SUBMIT: {
          submitCountRef.current++;
          const validationErrors = (validator ?? defaultValidator)(latestValuesRef.current);
          if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
          } else {
            onSubmit(latestValuesRef.current);
          }
          break;
        }
      }
    },
    [defaultValidator, onSubmit, validator]
  );

  return { values, errors, onAction };
};
