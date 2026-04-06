//lib
import { createPortal } from 'react-dom';

//components
import { VscCheck } from 'react-icons/vsc';
import { AiFillWarning } from 'react-icons/ai';

//types
import { Intent } from './types';

type Props = {
  message?: string;
  intent?: Intent;
};

const SuccessIcon = () => (
  <div className="expr-snackbar__icon expr-snackbar__icon--success">
    <VscCheck size={10} strokeWidth={0.7} />
  </div>
);

const ErrorIcon = () => (
  <div className="expr-snackbar__icon expr-snackbar__icon--error">
    <AiFillWarning size={12} strokeWidth={0.7} />
  </div>
);

const INTENT_VS_ERROR = {
  success: SuccessIcon,
  error: ErrorIcon,
};

export const Snackbar = ({ message, intent }: Props) => {
  const Icon = INTENT_VS_ERROR[intent ?? 'success'];

  return createPortal(
    message && intent ? (
      <div className="expr-snackbar">
        <Icon />
        <div className="expr-snackbar__message">{message}</div>
      </div>
    ) : null,
    document.body
  );
};
