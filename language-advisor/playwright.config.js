// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:8095",
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } }
  ],
  webServer: {
    command: "powershell -ExecutionPolicy Bypass -File serve.ps1",
    url: "http://localhost:8095",
    reuseExistingServer: true,
    timeout: 15000
  }
});
