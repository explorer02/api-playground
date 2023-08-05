//lib
import { MouseEvent, useCallback, useMemo } from 'react';

//components
import { Box } from '@sprinklrjs/spaceweb/box';
import { IconButton } from '@sprinklrjs/spaceweb/button';

//types
import { Action } from '../types';
import { ClassName } from '@sprinklrjs/spaceweb';

type Props = {
  actions: Action[];
  onActionClick: (action: string) => void;
  className?: ClassName;
};

export const RightActions = ({ actions, onActionClick, className }: Props): JSX.Element => {
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
      {actions.map(({ Icon, label, id }) => (
        <IconButton
          key={id}
          tooltipContent={label}
          bordered
          shape="square"
          size="xs"
          onClick={handleActionClick}
          data-id={id}
        >
          <Icon size={16} stroke="black" strokeWidth={0.3} />
        </IconButton>
      ))}
    </Box>
  );
};