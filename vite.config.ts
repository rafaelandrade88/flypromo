import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: '/flypromo/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FlightWatch',
        short_name: 'FlightWatch',
        description: 'Monitore e compare passagens aéreas com inteligência artificial',
        start_url: '/flypromo/',
        scope: '/flypromo/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        lang: 'pt-BR',
        icons: [
          { src: '/flypromo/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/flypromo/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
