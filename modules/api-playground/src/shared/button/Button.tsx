import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

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
  const mergedClassName = `explorer-button ${VARIANT_VS_CLASSNAME[variant]} ${SIZE_VS_CLASSNAME[size]} ${
    icon ? 'icon' : ''
  } ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} `;

  return (
    <div
      className={`explorer-button-container ${tooltipContent ? 'explorer-tooltip' : ''} ${className}`}
      data-tooltip={tooltipContent}
    >
      <button {...rest} className={mergedClassName} disabled={disabled} />
    </div>
  );
};
