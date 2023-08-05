import { Game, GameConfig } from '@/modules/api-playground';
import { CLIENT } from './constants';

export const GAME_CONFIG: GameConfig[] = [
  {
    id: 'current_user',
    type: Game.STATIC_DATA,
    data: {
      name: 'Ajay Bhardwaj',
      age: 24,
    },
    title: 'Current User',
  },
  {
    id: 'apollo_cache',
    type: Game.CACHE_VIEWER,
    title: 'Cache Viewer',
    client: CLIENT,
    // readOnly: true,
  },
  {
    id: 'query_executor',
    type: Game.QUERY_EXECUTOR,
    title: 'Query Executor',
    client: CLIENT,
  },
];
