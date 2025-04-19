// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/auth': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        secure: false, // If your backend is not using HTTPS
      },
    },
  },
});
