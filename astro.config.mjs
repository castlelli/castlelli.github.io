// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://castlelli.github.io',
  devToolbar: { enabled: false },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: { prefixDefaultLocale: false },
  },
});
