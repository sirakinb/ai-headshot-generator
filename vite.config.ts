import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Optimize for production
        minify: 'terser',
        rollupOptions: {
          output: {
            manualChunks: {
              // Separate vendor chunks for better caching
              'clerk': ['@clerk/clerk-react'],
              'google': ['@google/genai']
            }
          }
        }
      }
    };
});
