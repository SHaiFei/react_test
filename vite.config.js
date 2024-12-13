import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },

  server: {
    open: false,
    proxy: {
      "/api": {
        target: "https://test.ratubrain.com/api",
        changeOrigin: true, // 更改请求的 origin 为目标 URL
        rewrite: (path) => path.replace(/^\/api/, ""), // 重写路径，例如将 '/api/user' 转为 '/user'
      },
    },
  },
});
