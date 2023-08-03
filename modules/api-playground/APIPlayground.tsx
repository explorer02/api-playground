'use client';

// lib
import { useCallback, useMemo, useState } from 'react';

// components
import { Box } from '@sprinklrjs/spaceweb/box';
import { SideNav } from './components/SideNav';

//hooks
import { useSideNavItems } from './hooks/useSideNavItems';

//constants
import { Game, SubGame } from './constants/game';

export const APIPlayground = (): JSX.Element => {
  const [activeGame, setActiveGame] = useState<Game>(Game.CURRENT_USER);
  const [activeSubGame, setActiveSubGame] = useState<SubGame>();

  const onNavItemClick = useCallback((game: Game, subGame?: SubGame) => {
    setActiveGame(game);
    setActiveSubGame(subGame);
  }, []);

  const sideNavItems = useSideNavItems();
  const Component = useMemo(() => {
    const activeNavItem = sideNavItems.find(item => item.id === activeGame)!;
    if (activeSubGame) {
      return activeNavItem.children!.find(child => child.id === activeSubGame)!.Component;
    }
    return activeNavItem.Component;
  }, [activeGame, activeSubGame, sideNavItems]);

  return (
    <Box className="w-full flex gap-8 h-full">
      <Box className="flex-none">
        <SideNav activeGame={activeGame} activeSubGame={activeSubGame} onNavItemClick={onNavItemClick} />
      </Box>
      <Box className="flex-1">
        <Component />
      </Box>
    </Box>
  );
};
