import { DetailedHTMLProps, InputHTMLAttributes, WheelEventHandler, forwardRef, useCallback } from 'react';

import './styles.css';

type Props = Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'size'> & {
  error?: boolean;
  size?: 'xs' | 'md';
  isActive?: boolean;
};

const SIZE_VS_CLASSNAME = {
  xs: 'size-xs',
  md: '',
};

// eslint-disable-next-line react/display-name
export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, error, type, size = 'md', isActive, ...rest }, ref) => {
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
        className={`explorer-space-input ${error ? 'error' : ''} ${SIZE_VS_CLASSNAME[size]} ${
          isActive ? 'active' : ''
        } ${className ? className : ''}`}
        // className="explorer-space-input"
        onWheel={onWheel}
        type={type}
        ref={ref}
      />
    );
  }
);
