import type { StorybookConfig } from '@storybook/nextjs';
import type { RuleSetRule } from 'webpack';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../src/app/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/app/**/*.docs.mdx',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-postcss',
    '@storybook/addon-a11y',
    '@storybook/addon-docs'
  ],
  docs: {
    autodocs: 'tag', // o 'auto'
    defaultName: 'Documentación',
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
    cfg.resolve = {
      ...(cfg.resolve ?? {}),
      alias: {
        ...(cfg.resolve?.alias ?? {}),
        '@/app/main-page/hooks/useMainPage': path.resolve(
          __dirname,
          '../src/__mocks__/FakeMainPageProvider.tsx'
        ),
      },
    };

    return cfg;
  },
};

export default config;
