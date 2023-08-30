import { Typography } from '@/shared/typography';
import { ReactNode } from 'react';

type Props = {
  onBlur?: () => void;
  label?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
};

export const FormControl = ({ onBlur, error, label, children, required }: Props): JSX.Element => {
  return (
    <div onBlur={onBlur}>
      {label ? (
        <div className="flex items-center gap-1 mb-1">
          <Typography>{label} </Typography>
          {required ? <div className="h-1 w-1 spr-support-error rounded-full" /> : null}
        </div>
      ) : null}
      {children}
      {error ? <Typography className="spr-support-error-text">{error}</Typography> : null}
    </div>
  );
};
