import { test, expect } from "@playwright/test";

test.describe("Add Space", () => {
  test("should show add space button when no spaces exist", async ({
    page,
  }) => {
    await page.goto("/workspace/test-workspace-id");

    await expect(page.getByTestId("add-space-button")).toBeVisible();
    await expect(page.getByText("No spaces found")).toBeVisible();
  });

  test("should create space with valid name", async ({ page }) => {
    await page.goto("/workspace/test-workspace-id");

    await page.getByTestId("add-space-button").click();

    await expect(page.getByTestId("space-name-input")).toBeVisible();

    await page.getByTestId("space-name-input").fill("My New Space");
    await page.getByTestId("confirm-space-button").click();

    await expect(page.getByText("My New Space")).toBeVisible();
  });

  test("should create space using Enter key", async ({ page }) => {
    await page.goto("/workspace/test-workspace-id");

    await page.getByTestId("add-space-button").click();
    await page.getByTestId("space-name-input").fill("Space via Enter");
    await page.getByTestId("space-name-input").press("Enter");

    await expect(page.getByText("Space via Enter")).toBeVisible();
  });

  test("should cancel space creation", async ({ page }) => {
    await page.goto("/workspace/test-workspace-id");

    await page.getByTestId("add-space-button").click();
    await page.getByTestId("space-name-input").fill("Cancelled Space");
    await page.getByTestId("cancel-space-button").click();

    await expect(page.getByTestId("space-name-input")).not.toBeVisible();
    await expect(page.getByTestId("add-space-button")).toBeVisible();
  });

  test("should show validation error for short name", async ({ page }) => {
    await page.goto("/workspace/test-workspace-id");

    await page.getByTestId("add-space-button").click();
    await page.getByTestId("space-name-input").fill("ab");
    await page.getByTestId("confirm-space-button").click();

    await expect(page.getByTestId("space-error-message")).toBeVisible();
    await expect(page.getByTestId("space-error-message")).toContainText(
      "pelo menos 3 caracteres",
    );
  });

  test("should show validation error for special characters", async ({
    page,
  }) => {
    await page.goto("/workspace/test-workspace-id");

    await page.getByTestId("add-space-button").click();
    await page.getByTestId("space-name-input").fill("test@#$%");
    await page.getByTestId("confirm-space-button").click();

    await expect(page.getByTestId("space-error-message")).toBeVisible();
    await expect(page.getByTestId("space-error-message")).toContainText(
      "apenas letras, números",
    );
  });

  test("should navigate to space when clicked", async ({ page }) => {
    await page.goto("/workspace/test-workspace-id");

    // Assuming there's an existing space
    await page.getByText("My Space").click();

    await expect(page.url()).toContain("/workspace/test-workspace-id/space/");
  });

  test("should show add space button even when spaces exist", async ({
    page,
  }) => {
    await page.goto("/workspace/test-workspace-id");

    // The Add Space button should always be visible, regardless of existing spaces
    await expect(page.getByTestId("add-space-button")).toBeVisible();
  });
});
