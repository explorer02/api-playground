import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import { Tooltip } from '../tooltip';

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'xs' | 'sm' | 'md';
  tooltipContent?: string;
  icon?: boolean;
  selected?: boolean;
};

const VARIANT_VS_CLASSNAME = {
  primary: 'variant-primary',
  secondary: 'variant-secondary',
};

const SIZE_VS_CLASSNAME = {
  xs: 'size-xs',
  sm: 'size-sm',
  md: '',
};

export const Button = ({
  className,
  loading,
  variant = 'primary',
  size = 'md',
  tooltipContent,
  icon,
  selected,
  disabled,
  ...rest
}: Props) => {
  const mergedClassName = `explorer-space-button ${className ? className : ''} ${VARIANT_VS_CLASSNAME[variant]} ${
    SIZE_VS_CLASSNAME[size]
  } ${icon ? 'icon' : ''} ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`;

  if (tooltipContent) {
    return (
      <Tooltip content={tooltipContent}>
        {({ onMouseEnter, onMouseLeave }) => (
          <button {...rest} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={mergedClassName} />
        )}
      </Tooltip>
    );
  }
  return <button {...rest} className={mergedClassName} disabled={disabled} />;
};
