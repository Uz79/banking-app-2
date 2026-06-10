import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, '..');

/** Serve /app/js/* in dev (works even when staticDirs were added after server start). */
function viteServeAppJs() {
  return {
    name: 'storybook-serve-app-js',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/app/js/')) return next();
        const rel = url.slice('/app/js/'.length).split('?')[0];
        const filePath = path.join(webRoot, 'js', rel);
        if (!filePath.startsWith(path.join(webRoot, 'js')) || !fs.existsSync(filePath)) {
          return next();
        }
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        fs.createReadStream(filePath).pipe(res);
      });
    },
  };
}

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ['../src/stories/**/*.stories.@(js|mjs)'],
  addons: ['@storybook/addon-onboarding', '@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  staticDirs: [
    '../assets',
    { from: '../../../designs', to: '/designs' },
    { from: '../js', to: '/app/js' },
    { from: '../overview.html', to: '/app/overview.html' },
    { from: '../payments.html', to: '/app/payments.html' },
    { from: '../account-details.html', to: '/app/account-details.html' },
    { from: '../all-bookings-and-payments.html', to: '/app/all-bookings-and-payments.html' },
  ],
  viteFinal: async (config) => ({
    ...config,
    plugins: [...(config.plugins || []), viteServeAppJs()],
    server: {
      ...config.server,
      proxy: {
        '/api/yahoo': {
          target: 'https://query1.finance.yahoo.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
        },
      },
      fs: {
        ...config.server?.fs,
        allow: [...(config.server?.fs?.allow || []), webRoot],
      },
    },
  }),
};

export default config;
