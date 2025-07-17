import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // 👈 Your Vite frontend port
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
  },
});
