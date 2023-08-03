import { useMemo } from 'react';

import { Snippet } from './Snippet';

const user = { name: 'Ajay', email: 'a@b.com' };

export const CurrentUserPreview = (): JSX.Element => {
  const stringifiedUser = useMemo(() => JSON.stringify(user, null, 4), [user]);

  return <Snippet title="Logged in User" content={stringifiedUser} />;
};
