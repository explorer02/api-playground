import { Box } from '@sprinklrjs/spaceweb/box';
import { Typography } from '@sprinklrjs/spaceweb/typography';
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
        <Box className="flex items-center gap-1 mb-1">
          <Typography>{label} </Typography>
          {required ? <Box className="h-1 w-1 spr-support-error rounded-full" /> : null}
        </Box>
      ) : null}
      {children}
      {error ? <Typography className="spr-support-error-text">{error}</Typography> : null}
    </div>
  );
};
