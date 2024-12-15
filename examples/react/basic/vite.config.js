import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/shadow/nested': {
        target: 'http://google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shadow/, ''),
      },
      '/shadow': {
        target: 'http://example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shadow/, ''),
        bypass: (req) => {
          if (req.url.includes('client')) {
            return req.url
          }
        },
      },
    },
  },
})
