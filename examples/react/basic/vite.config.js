import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users/123': {
        target: 'http://example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shadow/, ''),
        bypass: (req) => {
          if (req.url.includes('activities')) {
            return req.url
          }
        },
      },
    },
  },
})
