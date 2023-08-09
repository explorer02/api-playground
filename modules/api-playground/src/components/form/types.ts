import { FieldConfig } from '@/types';
import { OnFormAction } from './actionType';

type FieldValue = string | number;

export type FormFieldComponentProps = Omit<FieldConfig, 'type' | 'initialValue'> & {
  id: string;
  onAction: OnFormAction;
  value?: FieldValue;
  error?: string;
};

export type FormValues = Record<string, FieldValue>;
export type FormErrors = Record<string, string>;
