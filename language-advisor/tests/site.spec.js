const { test, expect } = require("@playwright/test");

test("homepage loads with quiz and library", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".quiz-question")).toBeVisible();
  await expect(page.locator(".lang-card")).toHaveCount(23);
});

test("'Just ask' recommends Python for a calculator", async ({ page }) => {
  await page.goto("/");
  await page.fill("#ask-input", "I want to make a calculator");
  await page.click("#ask-btn");
  await expect(page.locator("#ask-result .result-lang-name")).toHaveText("Python");
});

test("'Just ask' recommends Kotlin for an Android app", async ({ page }) => {
  await page.goto("/");
  await page.fill("#ask-input", "I want to build an android app");
  await page.click("#ask-btn");
  await expect(page.locator("#ask-result .result-lang-name")).toHaveText("Kotlin");
});

test("'Just ask' falls back gracefully on gibberish input", async ({ page }) => {
  await page.goto("/");
  await page.fill("#ask-input", "asdkjhasdkjh");
  await page.click("#ask-btn");
  await expect(page.locator("#ask-result")).toContainText("couldn't quite place that");
});

test("quiz can be answered end to end and produces a recommendation", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Data analysis, AI, or machine learning").click();
  await page.getByText("Yes, I know at least one language well").click();
  await page.getByText("Building something fun quickly").click();
  await page.getByText("Forgiving and quick to see results").click();
  await expect(page.locator(".result-lang-name")).toBeVisible();
});

test("library search filters correctly", async ({ page }) => {
  await page.goto("/");
  await page.fill("#search-input", "rust");
  await expect(page.locator(".lang-card")).toHaveCount(1);
  await expect(page.locator(".lang-card h3")).toHaveText("Rust");
});

test("comparing two languages shows a comparison table", async ({ page }) => {
  await page.goto("/");
  await page.locator("#lang-python .compare-checkbox").check();
  await page.locator("#lang-javascript .compare-checkbox").check();
  await expect(page.locator("#compare-panel")).toBeVisible();
  await expect(page.locator("#compare-panel")).toContainText("Comparing 2 languages");
});

test("every github.com resource link is a real project or course reference", async ({ page }) => {
  await page.goto("/");
  const githubLinks = page.locator('.resource-link[href*="github.com"]');
  await expect(githubLinks).toHaveCount(24);
});

test("progress tracker starts empty and updates after tracking a language", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#progress-card")).toContainText("You're not tracking a language yet");
  await page.locator("#lang-python .track-btn").click();
  await expect(page.locator(".progress-lang-name")).toHaveText("Python");
});
