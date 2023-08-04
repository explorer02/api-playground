import { ApolloClient, InMemoryCache } from '@apollo/client';

import { Game } from './constants/game';

import { ClassName } from '@sprinklrjs/spaceweb';

type CommonGameConfig = {
  id: string;
  title: string;
};

export type StaticGameConfig = CommonGameConfig & {
  type: Game.STATIC_DATA;
  data: object | string;
  language?: string;
  readOnly?: boolean;
};

export type CacheViewerConfig = CommonGameConfig & {
  type: Game.CACHE_VIEWER;
  client: ApolloClient<InMemoryCache>;
};

export type GameConfig = StaticGameConfig | CacheViewerConfig;

export { ApolloClient };

export type APIPlaygroundProps = {
  config: GameConfig[];
  className?: ClassName;
};
