// This MUST be the first import!
import './instrument';

import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!, {
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(<App />);
