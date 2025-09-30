import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN || '',
  environment: process.env.REACT_APP_ENV || process.env.NODE_ENV,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  beforeSend(event) {
    if (event.request?.url) {
      try {
        const u = new URL(event.request.url);
        u.search = '';
        event.request.url = u.toString();
      } catch {}
    }
    return event;
  },
});
