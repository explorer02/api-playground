//lib
import { MouseEvent, memo, useCallback, useMemo } from 'react';

//components
import { Box } from '@sprinklrjs/spaceweb/box';
import { Button, IconButton } from '@sprinklrjs/spaceweb/button';

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
      {actions.map(({ Icon, label, id, type }) => {
        if (type === 'cta') {
          return (
            <Button
              key={id}
              startEnhancer={Icon ? <Icon /> : undefined}
              size="xs"
              onClick={handleActionClick}
              data-id={id}
              isLoading={loading}
            >
              {label}
            </Button>
          );
        }
        return (
          <IconButton
            key={id}
            tooltipContent={label}
            bordered
            shape="square"
            size="xs"
            onClick={handleActionClick}
            data-id={id}
            isLoading={loading}
          >
            {Icon ? <Icon size={16} stroke="black" strokeWidth={0.3} /> : null}
          </IconButton>
        );
      })}
    </Box>
  );
};

const MemoizedRightActions = memo(RightActions);

export { MemoizedRightActions as RightActions };
