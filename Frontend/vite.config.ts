import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy configuration to resolve CORS issues in Development
    // Requests starting with these prefixes will be forwarded to the Spring Boot Backend
    proxy: {
      '/public': {
        target: 'http://localhost:8080/journal', // Forward to backend context path
        changeOrigin: true,
        secure: false,
      },
      '/user': {
        target: 'http://localhost:8080/journal',
        changeOrigin: true,
        secure: false,
      },
      '/journal': {
        target: 'http://localhost:8080/journal',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://localhost:8080/journal',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
