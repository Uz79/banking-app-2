import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));

/**
 * Static multi-page banking shell (overview / payments / …): link CSS from HTML as usual.
 * Listing HTML inputs fixes `vite build` so every page is emitted; dev server serves them at /overview.html etc.
 */
export default {
  root: dir,
  server: {
    open: '/overview.html',
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(dir, 'index.html'),
        overview: resolve(dir, 'overview.html'),
        accountDetails: resolve(dir, 'account-details.html'),
        payments: resolve(dir, 'payments.html'),
        profile: resolve(dir, 'profile.html'),
        accountInformation: resolve(dir, 'account-information.html'),
      },
    },
  },
};
