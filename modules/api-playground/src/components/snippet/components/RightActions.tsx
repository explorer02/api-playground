//lib
import { MouseEvent, memo, useCallback, useMemo } from 'react';

//components
import { Box } from '@sprinklrjs/spaceweb/box';
import { Button } from '@/spaceweb/button';

//types
import { Action } from '../types';
import { ClassName } from '@sprinklrjs/spaceweb';

type Props = {
  actions: Action[];
  onActionClick: (action: string) => void;
  className?: ClassName;
  loading?: boolean;
};

const RightActions = ({ actions, onActionClick, className, loading }: Props): JSX.Element => {
  const handleActionClick = useCallback(
    (ev: MouseEvent<HTMLElement>) => {
      if (ev.currentTarget.dataset.id) {
        onActionClick(ev.currentTarget.dataset.id);
      }
    },
    [onActionClick]
  );

  return (
    <Box className={['flex gap-2 justify-end', className]}>
      {actions.map(({ Icon, label, id, type, disabled }) => {
        if (type === 'cta') {
          return (
            <Button key={id} size="xs" onClick={handleActionClick} data-id={id} loading={loading} disabled={disabled}>
              {Icon ? <Icon /> : null}
              {label}
            </Button>
          );
        }
        return (
          <Button
            key={id}
            tooltipContent={label}
            size="xs"
            onClick={handleActionClick}
            data-id={id}
            loading={loading}
            disabled={disabled}
            variant="secondary"
            icon
          >
            {Icon ? <Icon size={16} strokeWidth={0.3} /> : null}
          </Button>
        );
      })}
    </Box>
  );
};

const MemoizedRightActions = memo(RightActions);

export { MemoizedRightActions as RightActions };
