import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
  ],
  server: {
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/auth': {
        target: `${process.env.SERVER_URL}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
