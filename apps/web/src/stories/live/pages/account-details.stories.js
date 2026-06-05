import {
  loadAppScripts,
  refreshPayStateDom,
} from '../../../../.storybook/load-app-scripts.js';
import {
  accountDetailsLiveMarkup,
  ACCOUNT_DETAILS_LIVE_SCRIPTS,
} from './account-details-live-markup.js';

export default {
  title: 'Live/Pages/Account Details',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Account details shell with app scripts: carousel, per-account bookings, and payment-details overlay. Tap a booking row to open details.',
      },
    },
  },
  decorators: [
    (story) => {
      document.body.classList.add('body');
      document.body.setAttribute('data-screen', 'account-details');
      document.body.setAttribute('data-page', 'account-details');
      return story();
    },
  ],
};

export const Interactive = {
  name: 'Interactive (with scripts)',
  render: () => accountDetailsLiveMarkup(),
  play: async () => {
    await loadAppScripts(ACCOUNT_DETAILS_LIVE_SCRIPTS);
    refreshPayStateDom();
  },
};
