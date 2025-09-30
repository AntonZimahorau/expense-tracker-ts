import * as Sentry from '@sentry/react';
import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return (
    <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
      <RouterProvider router={router} />;
    </Sentry.ErrorBoundary>
  );
}

export default App;
