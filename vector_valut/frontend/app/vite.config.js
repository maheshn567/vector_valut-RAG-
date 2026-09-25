import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Listen on all interfaces (IPv4 + IPv6) so nginx's proxy_pass to 127.0.0.1
    // can actually reach it — Vite defaults to IPv6 loopback only otherwise.
    host: true,
    // Allow any *.localhost or *.mahesh.com subdomain for per-tenant vanity URLs
    allowedHosts: [".localhost", ".mahesh.com"],
    proxy: {
      // Forward API and WebSocket traffic to the backend so relative URLs
      // ("/api/v1/...", "/socket.io/...") work identically whether the app is
      // hit directly (localhost:5173) or through the nginx *.mahesh.com proxy.
      "/api": {
        target: "http://localhost:5000",
        // Preserve the original Host header (e.g. acmecorp.mahesh.com) so the
        // backend's dynamic cookie-domain logic sees the real browser-facing
        // host, not "localhost:5000". The Express backend doesn't do any
        // vhost-based routing, so changeOrigin isn't needed here.
        changeOrigin: false,
      },
      "/socket.io": {
        target: "http://localhost:5000",
        ws: true,
        changeOrigin: false,
      },
    },
  },
})
