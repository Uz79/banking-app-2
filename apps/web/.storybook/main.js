/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ['../src/stories/**/*.stories.@(js|mjs)'],
  addons: ['@storybook/addon-onboarding', '@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  staticDirs: ['../assets'],
};

export default config;
