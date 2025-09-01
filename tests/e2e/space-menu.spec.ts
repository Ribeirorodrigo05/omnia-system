import { test, expect } from "@playwright/test";

test.describe("Space Menu Actions", () => {
  test("should show dot menu on hover", async ({ page }) => {
    await page.goto("/workspace/test-workspace-id");

    // Hover over a space item
    await page.getByTestId("space-item-test-space-id").hover();

    // Check if dot menu becomes visible
    await expect(page.getByTestId("space-menu-test-space-id")).toBeVisible();
  });

  test("should rename space successfully", async ({ page }) => {
    await page.goto("/workspace/test-workspace-id");

    // Open space menu
    await page.getByTestId("space-item-test-space-id").hover();
    await page.getByTestId("space-menu-test-space-id").click();

    // Click rename option
    await page.getByTestId("rename-space-test-space-id").click();

    // Rename input should appear
    await expect(
      page.getByTestId("rename-space-input-test-space-id"),
    ).toBeVisible();

    // Enter new name
    await page.getByTestId("rename-space-input-test-space-id").clear();
    await page
      .getByTestId("rename-space-input-test-space-id")
      .fill("Renamed Space");

    // Confirm rename
    await page.getByTestId("confirm-rename-test-space-id").click();

    // Check if space was renamed
    await expect(page.getByText("Renamed Space")).toBeVisible();
  });

  test("should cancel rename with X button", async ({ page }) => {
    await page.goto("/workspace/test-workspace-id");

    await page.getByTestId("space-item-test-space-id").hover();
    await page.getByTestId("space-menu-test-space-id").click();
    await page.getByTestId("rename-space-test-space-id").click();

    await page.getByTestId("rename-space-input-test-space-id").fill("New Name");
    await page.getByTestId("cancel-rename-test-space-id").click();

    // Should return to normal view
    await expect(
      page.getByTestId("rename-space-input-test-space-id"),
    ).not.toBeVisible();
    await expect(page.getByTestId("space-item-test-space-id")).toBeVisible();
  });

  test("should cancel rename with Escape key", async ({ page }) => {
    await page.goto("/workspace/test-workspace-id");

    await page.getByTestId("space-item-test-space-id").hover();
    await page.getByTestId("space-menu-test-space-id").click();
    await page.getByTestId("rename-space-test-space-id").click();

    await page.getByTestId("rename-space-input-test-space-id").fill("New Name");
    await page.getByTestId("rename-space-input-test-space-id").press("Escape");

    // Should return to normal view
    await expect(
      page.getByTestId("rename-space-input-test-space-id"),
    ).not.toBeVisible();
    await expect(page.getByTestId("space-item-test-space-id")).toBeVisible();
  });

  test("should show create submenu", async ({ page }) => {
    await page.goto("/workspace/test-workspace-id");

    await page.getByTestId("space-item-test-space-id").hover();
    await page.getByTestId("space-menu-test-space-id").click();

    // Hover over create menu to show submenu
    await page.getByTestId("create-menu-test-space-id").hover();

    // Check if folder option is visible
    await expect(page.getByTestId("create-folder-test-space-id")).toBeVisible();
  });

  test("should not navigate when clicking on dot menu", async ({ page }) => {
    await page.goto("/workspace/test-workspace-id");

    const initialUrl = page.url();

    await page.getByTestId("space-item-test-space-id").hover();
    await page.getByTestId("space-menu-test-space-id").click();

    // URL should not change when clicking menu
    expect(page.url()).toBe(initialUrl);
  });
});
