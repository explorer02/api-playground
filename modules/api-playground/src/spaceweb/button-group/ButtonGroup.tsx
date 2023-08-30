import { CSSProperties } from 'react';
import { Button } from '../button';

type ButtonConfig = {
  id: string;
  label: string;
};

type Props = {
  style?: CSSProperties;
  className?: string;

  config: ButtonConfig[];
  selectedIdx: number;

  onClick: (idx: number) => void;

  size?: 'xs' | 'sm' | 'md';
};

export const ButtonGroup = ({ style, className = '', config, selectedIdx, size, onClick }: Props) => {
  return (
    <div>
      <div
        className={`border-1 border-solid spr-border-03 flex rounded-8 ${className}`}
        style={{ padding: '3px', gap: '3px', width: 'fit-content', ...style }}
      >
        {config.map((button, idx) => (
          <Button
            key={button.id}
            variant="secondary"
            className={`${idx === selectedIdx ? 'font-600' : 'font-400'}`}
            size={size}
            selected={idx === selectedIdx}
            style={{ minWidth: '100px', border: 'none' }}
            onClick={() => {
              onClick(idx);
            }}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
