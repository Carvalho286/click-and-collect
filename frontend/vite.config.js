import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:2828",
        changeOrigin: true,
        secure: false,
      },
      "/dish": {
        target: "http://localhost:2828",
        changeOrigin: true,
        secure: false,
      },
      "/guest": {
        target: "http://localhost:2828",
        changeOrigin: true,
        secure: false,
      },
      "/reservation": {
        target: "http://localhost:2828",
        changeOrigin: true,
        secure: false,
      },
      "/user": {
        target: "http://localhost:2828",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
