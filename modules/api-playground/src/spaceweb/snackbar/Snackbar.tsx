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
  <div
    style={{
      width: '14px',
      height: '14px',
      borderRadius: '100%',
      background: '#6AC96E',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 'none',
    }}
  >
    <VscCheck size={10} strokeWidth={0.7} />
  </div>
);

const ErrorIcon = () => (
  <div
    style={{
      width: '14px',
      height: '14px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 'none',
    }}
  >
    <AiFillWarning size={12} strokeWidth={0.7} style={{ fill: '#C70F5C' }} />
  </div>
);

const INTENT_VS_ERROR = {
  success: SuccessIcon,
  error: ErrorIcon,
};

const INTENT_VS_ICON_BG = {
  success: '#6AC96E',
  error: '#C70F5C',
};

export const Snackbar = ({ message, intent }: Props) => {
  const Icon = INTENT_VS_ERROR[intent ?? 'success'];

  return createPortal(
    message && intent ? (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',

          width: 'fit-content',
          transform: 'translateX(-50%)',

          padding: '12px 16px',
          borderRadius: '8px',

          background: 'rgb(33, 33, 35)',

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px',
        }}
        id="snackbar"
      >
        <Icon />
        <div style={{ color: 'white', fontSize: '13px' }}>{message}</div>
      </div>
    ) : null,
    document.body
  );
};
