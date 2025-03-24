import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import minip from "./vite-plugin-minip";

export default defineConfig({
  plugins: [solid(), minip()],
  server: {
    host: "192.168.0.32",
  },
  build: {
    target: "esnext",
  },
  base: "",
});
