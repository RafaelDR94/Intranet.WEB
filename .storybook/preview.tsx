
import '../src/app/globals.css';
import type { Preview } from '@storybook/react';
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.id.includes('dark') ? 'dark' : 'light';

      // set data-theme en el html
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }

      return (
        <div className="p-4 min-h-screen bg-[var(--color-gray-10)] text-[var(--color-foreground)]">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;