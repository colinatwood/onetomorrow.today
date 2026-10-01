const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const pages = ["/", "/why", "/plan", "/learn", "/join", "/news", "/privacy", "/terms", "/accessibility", "/404.html"];

for (const path of pages) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations.filter(violation => ["serious", "critical"].includes(violation.impact))).toEqual([]);
  });
}
