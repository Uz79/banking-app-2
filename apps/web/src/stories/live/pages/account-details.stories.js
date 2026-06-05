import { livePagePlay, livePageRender } from '../../../../.storybook/mount-live-page.js';

export default {
  title: 'Live/Pages/Account Details',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full account-details page with app scripts: carousel, booking rows → payment details, Pay / IAT / account information overlays, theme toggle.',
      },
    },
  },
};

export const Interactive = {
  name: 'Interactive (full page)',
  render: livePageRender(),
  play: async ({ canvasElement }) => {
    await livePagePlay('account-details', canvasElement);
  },
};
