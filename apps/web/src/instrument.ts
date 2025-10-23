import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,

  enableLogs: true,
  integrations: [
    // React Router v6 integration for automatic route tracking
    // Captures all 5 Web Vitals: LCP, CLS, FCP, TTFB, INP
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
      // Performance monitoring options
      idleTimeout: 10000, // Wait 10 seconds for additional requests (default: 1000ms)
      _experiments: {
        enableStandaloneLcpSpans: true, // LCP: Largest Contentful Paint
        enableStandaloneClsSpans: true, // CLS: Cumulative Layout Shift (can happen after pageload)
      },
    }),

    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),

    // Session Replay for debugging user interactions
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: true,
      blockAllMedia: false,
    }),
  ],

  // Performance Monitoring
  tracesSampleRate: 1.0, // 100% in dev (reduce to 0.1-0.3 in production)

  // Distributed tracing - connect frontend to backend
  tracePropagationTargets: [import.meta.env.VITE_API_BASE_URL],

  // Session Replay sampling
  replaysSessionSampleRate: 1.0, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of errors

  sendDefaultPii: true,
  environment: import.meta.env.MODE,
});
