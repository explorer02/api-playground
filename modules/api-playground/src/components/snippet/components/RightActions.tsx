//lib
import { MouseEvent, memo, useCallback, useMemo } from 'react';

//components
import { Button } from '@/shared/button';

//types
import { Action } from '../types';

type Props = {
  actions: Action[];
  onActionClick: (action: string) => void;
  className?: string;
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
    <div className={`flex gap-2 justify-end ${className}`}>
      {actions.map(({ Icon, label, id, type, disabled }) => {
        if (type === 'cta') {
          return (
            <Button key={id} size="xs" onClick={handleActionClick} data-id={id} loading={loading} disabled={disabled}>
              {label}
              {Icon ? <Icon className="ml-2" /> : null}
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
    </div>
  );
};

const MemoizedRightActions = memo(RightActions);

export { MemoizedRightActions as RightActions };
