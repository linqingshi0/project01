import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: Number(env.WEB_PORT) || 5173,
      host: true
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    }
  };
});
