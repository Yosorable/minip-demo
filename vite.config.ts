import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import minipPlugin from "./vite-plugin-minip";

export default defineConfig({
  plugins: [solidPlugin(), minipPlugin()],
  server: {
    host: "192.168.0.32",
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  base: "",
  preview: {
    open: false,
  },
});
