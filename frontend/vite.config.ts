import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/film-react-nest/",
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ["src/scss"],
      },
    },
  },
});
