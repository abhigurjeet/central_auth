import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '2144-2401-4900-88c4-c34a-397f-1c83-f9ea-9dcf.ngrok-free.app', // 👈 your ngrok URL
      'localhost'], // ✅ Regex match for any ngrok subdomain
    cors: {
      origin: true,
      credentials: true
    }
  }
})
