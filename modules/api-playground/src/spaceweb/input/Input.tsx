import { DetailedHTMLProps, InputHTMLAttributes, WheelEventHandler, useCallback } from 'react';

import './styles.css';

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  error?: boolean;
};

export const Input = ({ className, error, type, ...rest }: Props) => {
  const onWheel = useCallback<WheelEventHandler<HTMLInputElement>>(
    ev => {
      if (type === 'number') {
        ev.currentTarget.blur();
      }
    },
    [type]
  );

  return (
    <input
      {...rest}
      className={`explorer-space-input ${error ? 'error' : ''} ${className ? className : ''}`}
      // className="explorer-space-input"
      onWheel={onWheel}
      type={type}
    />
  );
};
