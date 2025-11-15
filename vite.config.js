import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 4200,
        allowedHosts: true,
        cors: true,
        hmr: {
            protocol: 'wss',
            host: 'raicesvivas-frontend.ngrok-free.app',
            clientPort: 443
        }
    }
});