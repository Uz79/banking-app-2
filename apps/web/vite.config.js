import { cpSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));

/**
 * Files a script fetches at run time by a computed URL are not seen by Vite, so the build does not emit them.
 * They are copied as they are, to the path the built script resolves them to (assets/ next to the scripts).
 */
const copyRuntimeAssets = (...folders) => ({
  name: 'copy-runtime-assets',
  apply: 'build',
  closeBundle() {
    folders.forEach((f) => cpSync(resolve(dir, f), resolve(dir, 'dist', f), { recursive: true }));
  },
});

/**
 * Static multi-page banking shell (overview / payments / …): link CSS from HTML as usual.
 * Listing HTML inputs fixes `vite build` so every page is emitted; dev server serves them at /overview.html etc.
 */
export default {
  root: dir,
  plugins: [copyRuntimeAssets('assets/3d/fridge')],
  server: {
    port: 5175,
    strictPort: true,
    host: true,              // reachable from a phone on the same Wi-Fi
    allowedHosts: ['.local'], // the Mac's Bonjour name, e.g. klaudiuszs-macbook-pro.local
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
        designSystem: resolve(dir, 'design-system.html'),        // admin only
        motionSpecimens: resolve(dir, 'motion-specimens.html'),  // admin only
        components: resolve(dir, 'components.html'),             // admin only
        characterKit: resolve(dir, 'character-kit.html'),        // admin only
        playground: resolve(dir, 'playground.html'),             // admin only, full screen
        fridgeAdvisor: resolve(dir, 'fridge-advisor.html'),      // opens as a sheet from Overview > Offers
      },
    },
  },
};
