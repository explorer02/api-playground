//lib
import { useMemo } from 'react';

//components
import { CurrentUserPreview } from '../components/games/CurrentUserPreview';

//constants
import { Game, SubGame } from '../constants/game';

//types
import { NavItem } from '../types/nav';

const NullComponent = (): null => null;

export const useSideNavItems = (): NavItem[] =>
  useMemo(
    () => [
      { id: Game.CURRENT_USER, label: 'Current User', Component: CurrentUserPreview },
      { id: Game.QUERY_EXECUTOR, label: 'Query Executor', Component: NullComponent },
      { id: Game.MUTATION_EXECUTOR, label: 'Mutation Executor', Component: NullComponent },
      {
        id: Game.RECORD_MANAGER,
        label: 'Record Manager',
        Component: NullComponent,
        children: [
          {
            id: SubGame.RM_CREATE,
            label: 'Create RecordManagerPage',
            Component: NullComponent,
          },
          {
            id: SubGame.RM_UPDATE,
            label: 'Update RecordManagerPage',
            Component: NullComponent,
          },
          {
            id: SubGame.RM_USER_PREF,
            label: 'Clear User Preferences',
            Component: NullComponent,
          },
        ],
      },
    ],
    []
  );
