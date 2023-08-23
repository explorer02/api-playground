import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

const VARIANT_VS_STYLES = {
  h1: { fontSize: '32px', lineHeight: '40px', fontWeight: 600 },
  h2: { fontSize: '24px', lineHeight: '32px', fontWeight: 600 },
  h3: { fontSize: '2px', lineHeight: '28px', fontWeight: 600 },
  h4: { fontSize: '18px', lineHeight: '24px', fontWeight: 600 },
  h5: { fontSize: '16px', lineHeight: '22px', fontWeight: 600 },
  h6: { fontSize: '14px', lineHeight: '2px', fontWeight: 600 },
  h7: { fontSize: '13px', lineHeight: '22px', fontWeight: 600 },
  b1: { fontSize: '13px', lineHeight: '18px', fontWeight: 600 },
  b2: { fontSize: '12px', lineHeight: '16px', fontWeight: 600 },
  bl1: { fontSize: '14px', lineHeight: '22px', fontWeight: 400 },
  bl2: { fontSize: '13px', lineHeight: '20px', fontWeight: 400 },
  bl3: { fontSize: '12px', lineHeight: '20px', fontWeight: 400 },
  bs1: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },
  bs2: { fontSize: '13px', lineHeight: '20px', fontWeight: 400 },
  bs3: { fontSize: '12px', lineHeight: '20px', fontWeight: 400 },
  l1: { fontSize: '13px', lineHeight: '18px', fontWeight: 400 },
  l2: { fontSize: '12px', lineHeight: '16px', fontWeight: 400 },
  l3: { fontSize: '11px', lineHeight: '16px', fontWeight: 400 },
  l4: { fontSize: '10px', lineHeight: '14px', fontWeight: 400 },

  'body-16': { fontSize: '16px', lineHeight: '20px', fontWeight: 400 },
  'body-14': { fontSize: '14px', lineHeight: '18px', fontWeight: 400 },
} as const;

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> & {
  variant?: keyof typeof VARIANT_VS_STYLES;
};

export const Typography = ({ variant = 'l1', className, style, ...rest }: Props) => {
  return (
    <div
      {...rest}
      style={{ ...VARIANT_VS_STYLES[variant], ...style }}
      className={`explorer-typography ${className ?? ''}`}
    />
  );
};
