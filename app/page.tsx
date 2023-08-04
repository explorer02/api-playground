'use client';

import { APIPlayground } from '@/modules/api-playground/dist';

import { GAME_CONFIG } from './config';

const Page = (): JSX.Element | null => {
  return <APIPlayground config={GAME_CONFIG} className="h-screen p-16" />;
};

export default Page;
