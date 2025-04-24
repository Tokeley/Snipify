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
    host: 'https://snipifyclient.vercel.app',
    port: 3000,
    proxy: {
      '/auth': {
        target: 'https://snipify-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
