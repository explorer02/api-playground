import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type Variant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7'
  | 'b1' | 'b2'
  | 'bl1' | 'bl2' | 'bl3'
  | 'bs1' | 'bs2' | 'bs3'
  | 'l1' | 'l2' | 'l3' | 'l4'
  | 'body-16' | 'body-14';

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> & {
  variant?: Variant;
};

export const Typography = ({ variant = 'l1', className, ...rest }: Props) => {
  return (
    <div {...rest} className={`expr-typography-${variant} expr-text-01 ${className ?? ''}`} />
  );
};
