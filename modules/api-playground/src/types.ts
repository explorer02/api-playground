import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

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
  client: ApolloClient<NormalizedCacheObject>;
  readOnly?: boolean;
};

export type QueryExecutorConfig = CommonGameConfig & {
  type: Game.QUERY_EXECUTOR;
  client: ApolloClient<NormalizedCacheObject>;
  config?: {
    input?: {
      title?: string;
    };
    variable?: {
      title?: string;
    };
    output?: {
      title?: string;
      readOnly?: boolean;
    };
  };
};

export type GameConfig = StaticGameConfig | CacheViewerConfig | QueryExecutorConfig;

export { ApolloClient };

export type APIPlaygroundProps = {
  config: GameConfig[];
  className?: ClassName;
};
