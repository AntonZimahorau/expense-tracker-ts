import React from 'react';
import ReactDOM from 'react-dom';
import styles from './GlobalErrorBanner.module.css';

type ErrorCtxType = { showError: (msg: string, ms?: number) => void };
const ErrorCtx = React.createContext<ErrorCtxType>({
  showError: (msg: string, ms?: number) => {},
});

export const useErrorBanner = () => {
  const ctx = React.useContext(ErrorCtx);
  return ctx.showError;
};

export const GlobalErrorBannerProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [message, setMessage] = React.useState<string | null>(null);

  const showError = React.useCallback((msg: string, ms = 5000) => {
    setMessage(msg);
    window.clearTimeout((showError as any)._t);
    (showError as any)._t = window.setTimeout(() => setMessage(null), ms);
  }, []);

  const handleClose = () => setMessage(null);

  return (
    <ErrorCtx.Provider value={{ showError }}>
      {children}
      {message &&
        ReactDOM.createPortal(
          <div className={styles.wrapper} role="alert" aria-live="assertive">
            <div className={styles.banner}>
              <span className={styles.text}>{message}</span>
              <button
                className={styles.close}
                onClick={handleClose}
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>,
          document.body,
        )}
    </ErrorCtx.Provider>
  );
};
