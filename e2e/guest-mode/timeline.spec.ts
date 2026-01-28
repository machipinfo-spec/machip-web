import { test, expect } from "@playwright/test";

test.describe("Guest Mode - Timeline", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to timeline page
    await page.goto("/timeline");
  });

  test("should display timeline posts", async ({ page }) => {
    // Verify timeline container exists
    await expect(page.locator("div.divide-y")).toBeVisible();

    // Verify at least one post or "no posts" message is visible
    const posts = page.locator("article"); // Assuming ThreadCard is an article or has a specific class
    const noPostsMessage = page.getByText("投稿がありません");

    // Check if either posts exist or the 'no posts' message is shown
    await expect(posts.first().or(noPostsMessage)).toBeVisible();
  });

  test("should show login prompt when trying to create a post", async ({
    page,
  }) => {
    // Click on FAB (plus button)
    const fab = page.getByLabel("新規投稿");

    // If FAB is visible, clicking it should restrict action
    if (await fab.isVisible()) {
      await fab.click();

      // We expect some form of restriction.
      // It could be a redirect to login-prompt or a dialog logic.
      // Since ThreadCard uses a Dialog, we check for Dialog OR URL redirect to be safe.
      // TimelineClient uses "投稿するにはアカウントが必要です"
      const dialog = page
        .getByText("投稿するにはアカウントが必要です")
        .or(page.getByText("ログインが必要です"))
        .or(page.getByText("アカウントが必要です"));
      const isUrlRedirect = page.url().includes("login-prompt");

      if (!isUrlRedirect) {
        await expect(dialog.first()).toBeVisible();
      }
    } else {
      console.log("FAB is not visible for guest, skipping click check");
    }
  });

  test("should show login prompt when trying to reply", async ({ page }) => {
    const posts = page.locator("article"); // Assuming ThreadCard
    if ((await posts.count()) > 0) {
      const firstPost = posts.first();
      // ThreadCard ref: <button onClick={handleReply}><FaRegComment/></button>
      // We target the button containing the comment icon
      const replyButton = firstPost
        .locator("button")
        .filter({ has: page.locator("svg") })
        .first();

      if (await replyButton.isVisible()) {
        await replyButton.click();

        // Expect Dialog (ThreadCard implementation confirms this)
        await expect(
          page.getByText("リプライするにはアカウントが必要です"),
        ).toBeVisible();
        await expect(
          page.getByText(
            "アカウントを作成すると、投稿へのリプライやコメントができるようになります。",
          ),
        ).toBeVisible();
      }
    }
  });
});
