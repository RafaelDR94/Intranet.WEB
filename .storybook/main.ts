import type { StorybookConfig } from '@storybook/nextjs';
import type { RuleSetRule } from 'webpack';

const config: StorybookConfig = {
  stories: [
    '../src/app/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-postcss',
    '@storybook/addon-a11y',
  ],
  docs: {
    autodocs: 'tag', // o 'auto'
  },
  framework: {
    name: '@storybook/nextjs',
    options: {
      builder: {
        useSWC: true, // 👈 soluciona el error de css-loader
      },
    },
  },
  staticDirs: ['../public', '../src/assets'],
  core: { builder: 'webpack5' },

  webpackFinal: async (cfg) => {
    const moduleRules = cfg.module?.rules ?? [];

    const updatedRules: RuleSetRule[] = moduleRules.map((rule) => {
      if (
        rule &&
        typeof rule === 'object' &&
        'test' in rule &&
        rule.test instanceof RegExp &&
        rule.test.test('.svg')
      ) {
        return {
          ...rule,
          exclude: /\.svg$/i,
        };
      }
      return rule as RuleSetRule;
    });

    updatedRules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    cfg.module = {
      ...(cfg.module ?? {}),
      rules: updatedRules,
    };

    return cfg;
  },
};

export default config;
