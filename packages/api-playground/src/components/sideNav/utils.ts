import { KeyboardEvent } from 'react';

export const handleKeyDown = (e: KeyboardEvent, action: () => void) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    action();
  }
};
