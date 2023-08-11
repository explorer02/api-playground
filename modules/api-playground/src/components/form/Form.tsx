// lib
import { ComponentType, memo, useCallback } from 'react';

// components
import { Box } from '@sprinklrjs/spaceweb/box';
import { FormFieldType } from '@/constants/formFieldTypes';
import { TextInput } from './components/TextInput';
import { NumberInput } from './components/NumberInput';
import { JSONInput } from './components/JSONInput';
import { Button } from '@/spaceweb/button/Button';

//types
import { FieldConfigMap, FormLayout } from '@/types';
import { ActionType, OnFormAction } from './actionType';
import { FormErrors, FormFieldComponentProps, FormValues } from './types';

const FIELD_TYPE_VS_COMPONENT: Record<FormFieldType, ComponentType<FormFieldComponentProps>> = {
  [FormFieldType.TEXT]: TextInput,
  [FormFieldType.NUMBER]: NumberInput,
  [FormFieldType.JSON]: JSONInput,
};

type FormProps = {
  layout: FormLayout;
  fieldConfigMap: FieldConfigMap;
  values: FormValues;
  errors: FormErrors;
  onAction: OnFormAction;
  loading?: boolean;
};

const GAP = 4;

const Arranger = ({ layout, fieldConfigMap, errors, values, onAction }: FormProps) => {
  const { fields, horizontal } = layout;

  return (
    <Box className={['flex', horizontal ? '' : 'flex-col', { gap: `${GAP * 4}px` }]}>
      {fields?.map(field => {
        if (typeof field === 'string') {
          const config = fieldConfigMap[field];
          const Component = FIELD_TYPE_VS_COMPONENT[config.type];

          return (
            <Component
              key={config.id}
              {...config}
              onAction={onAction}
              error={errors[config.id]}
              value={values[config.id]}
            />
          );
        }
        return (
          // eslint-disable-next-line react/jsx-key -- let it be default
          <Arranger
            layout={field}
            fieldConfigMap={fieldConfigMap}
            values={values}
            errors={errors}
            onAction={onAction}
          />
        );
      })}
    </Box>
  );
};

const MemoizedArranger = memo(Arranger);

const Form = ({ layout, fieldConfigMap, values, errors, onAction, loading }: FormProps): JSX.Element => {
  const onSubmit = useCallback(() => {
    onAction({ type: ActionType.ON_SUBMIT });
  }, [onAction]);

  return (
    <Box className="h-full">
      <MemoizedArranger
        layout={layout}
        fieldConfigMap={fieldConfigMap}
        values={values}
        errors={errors}
        onAction={onAction}
      />
      <Box className="flex justify-center mt-8">
        <Button onClick={onSubmit} loading={loading}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

const MemoizedForm = memo(Form);

export { MemoizedForm as Form };
