import { test, expect } from "@playwright/test";

test.describe("Guest Mode - Profile", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a random profile or specific id
    await page.goto("/profile/test-user-id");
  });

  test("should show login prompt when accessing profile", async ({ page }) => {
    // Wait for loading to finish (ProfilePage shows animate-pulse while checking mode)
    // We check that animate-pulse is NOT visible, or wait for the h2 which appears after loading.

    // Expect "ログインが必要です" heading
    // Using explicit h2 selector to avoid ambiguity
    await expect(
      page.locator("h2", { hasText: "ログインが必要です" }),
    ).toBeVisible();

    // Expect message
    await expect(
      page.getByText(
        "プロフィールを閲覧するには、アカウントへのログインが必要です。",
      ),
    ).toBeVisible();

    // Verify login button
    const loginButton = page.getByRole("link", { name: "ログインする" });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveAttribute("href", "/login-prompt");
  });
});
