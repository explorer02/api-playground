import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import './styles.css';

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'xs' | 'md';
  // FIXME:
  tooltipContent?: string;
};

const VARIANT_VS_CLASSNAME = {
  primary: 'variant-primary',
  secondary: 'variant-secondary',
};

const SIZE_VS_CLASSNAME = {
  xs: 'size-xs',
  md: '',
};

export const Button = ({ className, loading, variant = 'primary', size = 'md', ...rest }: Props) => {
  return (
    <button
      {...rest}
      className={`explorer-space-button ${className ? className : ''} ${VARIANT_VS_CLASSNAME[variant]} ${
        SIZE_VS_CLASSNAME[size]
      }`}
    />
  );
};
