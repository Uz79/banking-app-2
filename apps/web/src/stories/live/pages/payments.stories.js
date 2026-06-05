import { livePagePlay, livePageRender } from '../../../../.storybook/mount-live-page.js';

export default {
  title: 'Live/Pages/Payments',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Payments page with Pay flow modal, form fields, and theme toggle.',
      },
    },
  },
};

export const Interactive = {
  name: 'Interactive (full page)',
  render: livePageRender(),
  play: async ({ canvasElement }) => {
    await livePagePlay('payments', canvasElement);
  },
};
