import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4200,
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'raicesvivas-frontend.ngrok-free.app',
      '.ngrok-free.app' // Permite cualquier subdominio de ngrok
    ],
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    }
  }
});