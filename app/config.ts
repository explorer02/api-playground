import { Game, GameConfig } from '@/modules/api-playground';

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
];
