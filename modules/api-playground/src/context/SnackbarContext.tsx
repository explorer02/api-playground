//lib
import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

//components
import { Snackbar, Intent } from '@sprinklrjs/spaceweb/snackbar';

type SnackbarContextType = {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onWarning: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
  onSuccess: () => {},
  onError: () => {},
  onWarning: () => {},
});

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<{ message: string; intent: Intent }>();

  const clearStateAfterInterval = useCallback(() => {
    setTimeout(() => {
      setState(undefined);
    }, 5000);
  }, []);

  const contextValue = useMemo<SnackbarContextType>(
    () => ({
      onError: message => {
        setState({ message, intent: 'error' });
        clearStateAfterInterval();
      },
      onWarning: message => {
        setState({ message, intent: 'warning' });
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
