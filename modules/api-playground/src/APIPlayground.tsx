'use client';

// lib
import { useCallback, useMemo, useState } from 'react';

// components
import { Box } from '@sprinklrjs/spaceweb/box';
import { SideNav } from './components/SideNav';
import { StaticDataViewer } from './components/StaticDataViewer';
import { CacheViewer } from './components/cacheViewer';

//constants
import { Game } from './constants/game';

//types
import { APIPlaygroundProps } from './types';

export const APIPlayground = ({ config, className }: APIPlaygroundProps): JSX.Element => {
  const [activeNavItem, setActiveNavItem] = useState<string>(config[0].id);
  // const [activeSubGame, setActiveSubGame] = useState<SubGame>();

  // const onNavItemClick = useCallback((game: Game, subGame?: SubGame) => {
  //   setActiveGame(game);
  // setActiveSubGame(subGame);
  // }, []);

  const onNavItemClick = useCallback((navItem: string) => {
    setActiveNavItem(navItem);
  }, []);

  const activeGameConfig = useMemo(() => {
    return config.find(c => c.id === activeNavItem)!;
  }, [activeNavItem, config]);

  // const Component = useMemo(() => {
  //   const activeNavItem = sideNavItems.find(item => item.id === activeGame)!;
  //   if (activeSubGame) {
  //     return activeNavItem.children!.find(child => child.id === activeSubGame)!.Component;
  //   }
  //   return activeNavItem.Component;
  // }, [activeGame, activeSubGame, sideNavItems]);

  const activeGame = activeGameConfig.type;

  let el;
  if (activeGame === Game.STATIC_DATA) {
    el = <StaticDataViewer config={activeGameConfig} />;
  } else if (activeGame === Game.CACHE_VIEWER) {
    el = <CacheViewer config={activeGameConfig} />;
  }

  return (
    <Box className={['w-full flex gap-8 h-full', className]}>
      <Box className="flex-none">
        <SideNav config={config} activeNavItem={activeNavItem} onNavItemClick={onNavItemClick} />
      </Box>
      <Box className="flex-1">{el}</Box>
    </Box>
  );
};
