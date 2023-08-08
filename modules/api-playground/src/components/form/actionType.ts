import { Action } from '@/types';

export enum ActionType {
  ON_CHANGE = 'ON_CHANGE',
  ON_FIELD_BLUR = 'ON_FIELD_BLUR',
  ON_SUBMIT = 'ON_SUBMIT',
}

type FormChangeAction = Action<ActionType.ON_CHANGE, { fieldId: string; value: string | number }>;
type FieldBlurAction = Action<ActionType.ON_FIELD_BLUR, { fieldId: string }>;
type SubmitAction = Action<ActionType.ON_SUBMIT>;

type FormAction = FormChangeAction | FieldBlurAction | SubmitAction;

export type OnFormAction = (action: FormAction) => void;
