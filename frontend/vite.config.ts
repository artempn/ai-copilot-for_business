// Vite configuration
// Author: Погосян Артем Артурович (Pogosian Artem)
// VK: https://vk.com/iamartempn

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true
    }
  }
})

