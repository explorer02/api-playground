'use client';

import { useEffect, useState } from 'react';
import { PageWrapper } from './PageWrapper';

const Page = (): JSX.Element | null => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isMounted) {
    return <PageWrapper />;
  }

  return null;
};

export default Page;
