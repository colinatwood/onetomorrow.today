const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const pages = ["/", "/today", "/tomorrow", "/future", "/topics", "/status", "/governance", "/why", "/plan", "/learn", "/join", "/news", "/privacy", "/terms", "/accessibility", "/404.html"];

for (const path of pages) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations.filter(violation => ["serious", "critical"].includes(violation.impact))).toEqual([]);
  });
}

test("topic lookup tolerates a typo and filters by status", async ({ page }) => {
  await page.goto("/topics");
  await page.getByRole("searchbox").fill("goverance");
  await expect(page.getByRole("heading", { name: "Governance and corrections" })).toBeVisible();
  await page.getByLabel("Work status").selectOption("proposed");
  await expect(page.locator("[data-topic-count]")).toContainText("0 topics");
});

test("mobile horizon diagrams provide a visible exploration cue", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/today");
  await expect(page.locator(".mission-graphic")).toBeVisible();
  await expect(page.locator(".scroll-hint")).toBeVisible();
  await expect(page.locator(".change-roadmap li")).toHaveCount(5);
});

test("join form collects routing and consent details", async ({ page }) => {
  await page.goto("/join");
  await expect(page.getByRole("heading", { name: "A private request, followed by a human reply." })).toBeVisible();
  await expect(page.locator(".join-flow .status-steps li")).toHaveCount(4);
  await expect(page.getByLabel("Which branch interests you most?")).toBeVisible();
  await expect(page.getByLabel("How would you like to contribute?")).toBeVisible();
  await expect(page.getByLabel("What time can you realistically offer?")).toBeVisible();
  await expect(page.getByLabel(/I agree that OneTomorrow/)).toBeVisible();
});

test("governance offers guided public contribution paths", async ({ page }) => {
  await page.goto("/governance");
  await expect(page.getByRole("link", { name: "Open proposal form" })).toHaveAttribute("href", /template=proposal\.yml/);
  await expect(page.getByRole("link", { name: "Open correction form" })).toHaveAttribute("href", /template=correction\.yml/);
  await expect(page.getByRole("link", { name: "Open accessibility form" })).toHaveAttribute("href", /template=accessibility\.yml/);
  await expect(page.getByRole("link", { name: "Open status form" })).toHaveAttribute("href", /template=status-update\.yml/);
});
