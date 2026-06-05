import { livePagePlay, livePageRender } from '../../../../.storybook/mount-live-page.js';

export default {
  title: 'Live/Pages/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Overview page with theme toggle, product-item state layer, and Pay flow entry.',
      },
    },
  },
};

export const Interactive = {
  name: 'Interactive (full page)',
  render: livePageRender(),
  play: async ({ canvasElement }) => {
    await livePagePlay('overview', canvasElement);
  },
};
