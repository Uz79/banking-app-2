/** @type { import('@storybook/html-webpack5').StorybookConfig } */
const config = {
  stories: ['../src/stories/**/*.stories.@(js|mjs)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/html-webpack5',
    options: {},
  },
  staticDirs: ['../assets'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(otf|ttf|woff|woff2)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default config;
