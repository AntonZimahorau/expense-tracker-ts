import * as Sentry from '@sentry/react';
import { createBrowserRouter, useRouteError } from 'react-router-dom';
import React from 'react';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import RestorePassword from './pages/RestorePassword';
import AuthLayout from './layouts/AuthLayout/AuthLayout';
import TransactionsPage from './pages/TransactionsPage';
import ForgotPassword from './pages/ForgotPassword';
import VerificationCode from './pages/VerificationCode';
import ChangePasswordSuccess from './pages/ChangePasswordSuccess';
import UserProfile from './pages/UserProfile';
import TermsInfo from './pages/TermsInfo';
import RequireAuth from './layouts/RequireAuth/RequireAuth';

const sentryCreateBrowserRouter =
  Sentry.wrapCreateBrowserRouterV6(createBrowserRouter);

function RootRouteErrorBoundary() {
  const error = useRouteError() as Error;
  React.useEffect(() => {
    if (error) Sentry.captureException(error);
  }, [error]);
  return <p>Something went wrong.</p>;
}

const router = sentryCreateBrowserRouter([
  {
    path: '/',
    element: <RequireAuth />,
    errorElement: <RootRouteErrorBoundary />,
    children: [
      { path: '/', element: <TransactionsPage /> },
      {
        path: '/',
        element: <AuthLayout />,
        children: [{ path: '/user_profile', element: <UserProfile /> }],
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    errorElement: <RootRouteErrorBoundary />,
    children: [
      { path: '/signup', element: <SignUp /> },
      { path: '/signin', element: <SignIn /> },
      { path: '/forgot_password', element: <ForgotPassword /> },
      { path: '/verification_code', element: <VerificationCode /> },
      { path: '/restore_password', element: <RestorePassword /> },
      { path: '/password_changed', element: <ChangePasswordSuccess /> },
      { path: '/terms', element: <TermsInfo /> },
    ],
  },
]);

export default router;
