import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/bazar2/', // Caminho base para o subdiretório em que o aplicativo é servido
  plugins: [react()]
})