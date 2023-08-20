//lib
import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

//components
import { Snackbar, Intent } from '@/spaceweb/snackbar';

type SnackbarContextType = {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
  onSuccess: () => {},
  onError: () => {},
});

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{ message: string; intent: Intent }>();

  const timerRef = useRef<NodeJS.Timeout>();

  const clearStateAfterInterval = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setState(undefined);
      timerRef.current = undefined;
    }, 5000);
  }, []);

  const contextValue = useMemo<SnackbarContextType>(
    () => ({
      onError: message => {
        setState({ message, intent: 'error' });
        clearStateAfterInterval();
      },
      onSuccess: message => {
        setState({ message, intent: 'success' });
        clearStateAfterInterval();
      },
    }),
    [clearStateAfterInterval]
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar message={state?.message} intent={state?.intent} />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => useContext(SnackbarContext);
