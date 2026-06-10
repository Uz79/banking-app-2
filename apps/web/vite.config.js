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
    proxy: {
      '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(dir, 'index.html'),
        overview: resolve(dir, 'overview.html'),
        accountDetails: resolve(dir, 'account-details.html'),
        allBookings: resolve(dir, 'all-bookings-and-payments.html'),
        payments: resolve(dir, 'payments.html'),
        profile: resolve(dir, 'profile.html'),
        accountInformation: resolve(dir, 'account-information.html'),
        investmentProductDetails: resolve(dir, 'investment-product-details.html'),
        detailsOfPosition: resolve(dir, 'details-of-position.html'),
      },
    },
  },
};
