import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sentryVitePlugin({
      org: 'sergtech',
      project: 'unborked-frontend',
      reactComponentAnnotation: {
        enabled: true,
      },
    }),
  ],

  server: {
    port: 4173,
  },

  build: {
    sourcemap: true,
  },
});
