import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Stelle sicher, dass hier der richtige React-Plugin-Import steht (ggf. ohne -swc)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // Füge diesen Block hinzu
    proxy: {
      // Anfragen an /api/... werden an http://127.0.0.1:8000/api/... weitergeleitet
      '/api': {
        target: 'http://127.0.0.1:8000', // Deine Backend-Adresse
        changeOrigin: true, // Wichtig für virtuelle Hosts
        // Optional: Wenn dein Backend-API-Pfad nicht mit /api beginnt,
        // rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  }
})