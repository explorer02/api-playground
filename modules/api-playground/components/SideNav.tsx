// lib
import { useCallback, MouseEvent } from 'react';

// components
import { Box } from '@sprinklrjs/spaceweb/box';
import { Typography } from '@sprinklrjs/spaceweb/typography';

//hooks
import { useSideNavItems } from '../hooks/useSideNavItems';

//constants
import { Game, SubGame } from '../constants/game';

type Props = {
  activeGame: Game;
  activeSubGame: SubGame | undefined;
  onNavItemClick: (g: Game, s: SubGame) => void;
};

export const SideNav = ({ activeGame, activeSubGame, onNavItemClick }: Props): JSX.Element => {
  const sideNavItems = useSideNavItems();

  const handleItemClick = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      const { game, subgame } = ev.currentTarget.dataset;
      onNavItemClick(game as Game, subgame as SubGame);
    },
    [onNavItemClick]
  );

  return (
    <Box className="flex flex-col border-1 border-solid spr-border-03 rounded-8 overflow-hidden">
      {sideNavItems.map(navItem => (
        <Box key={navItem.id}>
          <Box
            className={[
              'px-4 py-3 cursor-pointer border-0 border-solid spr-border-03',
              navItem.id === activeGame ? 'spr-ui-04 spr-text-05' : 'hover:spr-ui-02',
              navItem.children?.length ? '' : 'border-b-1',
            ]}
            onClick={handleItemClick}
            data-game={navItem.id}
          >
            <Typography variant="body-16">{navItem.label}</Typography>
          </Box>
          <Box>
            {navItem.children?.map(child => (
              <Box
                key={child.id}
                className={[
                  'pl-8 pr-4 py-3 cursor-pointer spr-border-03',
                  child.id === activeSubGame ? 'spr-ui-03' : 'hover:spr-ui-02',
                ]}
                onClick={handleItemClick}
                data-game={navItem.id}
                data-subgame={child.id}
              >
                <Typography variant="body-16">{child.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
