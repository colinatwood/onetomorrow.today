const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    reducedMotion: "reduce"
  },
  webServer: {
    command: "npx serve dist --listen 4173 --no-clipboard",
    port: 4173,
    reuseExistingServer: !process.env.CI
  }
});
