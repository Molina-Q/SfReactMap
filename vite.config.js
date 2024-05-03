import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        proxy: {
          '/api': {
            target: 'http://127.0.0.1:8000',
            secure: false,
          },
        },
      },
    plugins: [
        react(),
        symfonyPlugin(),
    ],
    build: {
        rollupOptions: {
            input: {
                app: "./assets/main.jsx"
            },
        }
    },
});
