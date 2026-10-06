import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const base = '/touch-grass/'

export default defineConfig({
  base,
  build: {
    chunkSizeWarningLimit: 7000,
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Gardenwise — weekly garden planner',
        short_name: 'Gardenwise',
        description:
          'Frost dates from open climate data, a weekly checklist for your plot, and an optional on-device assistant.',
        theme_color: '#2E7D46',
        background_color: '#F7F9F5',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: `${base}icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: `${base}icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,jpg,woff,woff2}'],
        globIgnores: ['assets/lib-*.js'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: `${base}index.html`,
        runtimeCaching: [
          {
            urlPattern: /\/assets\/lib-.*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'webllm-lib',
              expiration: { maxEntries: 2, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
})
