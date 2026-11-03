import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    allowedHosts: [
      "3bdf-2405-4803-c816-4640-cad-cb6d-e072-c5fe.ngrok-free.app",
    ],
  },
});
