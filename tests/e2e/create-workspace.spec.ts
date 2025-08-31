import { test, expect } from "@playwright/test";

test.describe("Create Workspace", () => {
  test("should create workspace with valid name", async ({ page }) => {
    await page.goto("/home");

    await expect(page.getByTestId("workspace-name-input")).toBeVisible();

    await page.getByTestId("workspace-name-input").fill("Meu Workspace");

    await page.getByTestId("create-workspace-button").click();

    await expect(page.getByTestId("create-workspace-button")).toHaveText(
      /Criando.../,
    );
  });

  test("should show validation error for short name", async ({ page }) => {
    await page.goto("/home");

    await page.getByTestId("workspace-name-input").fill("abc");
    await page.getByTestId("create-workspace-button").click();

    await expect(page.getByTestId("error-message")).toBeVisible();
    await expect(page.getByTestId("error-message")).toContainText(
      "pelo menos 4 caracteres",
    );
  });

  test("should show validation error for special characters", async ({
    page,
  }) => {
    await page.goto("/home");

    await page.getByTestId("workspace-name-input").fill("test@#$%");
    await page.getByTestId("create-workspace-button").click();

    await expect(page.getByTestId("error-message")).toBeVisible();
    await expect(page.getByTestId("error-message")).toContainText(
      "apenas letras, números",
    );
  });

  test("should disable button when input is empty", async ({ page }) => {
    await page.goto("/home");

    await expect(page.getByTestId("create-workspace-button")).toBeDisabled();

    await page.getByTestId("workspace-name-input").fill("Valid Name");
    await expect(page.getByTestId("create-workspace-button")).toBeEnabled();

    await page.getByTestId("workspace-name-input").clear();
    await expect(page.getByTestId("create-workspace-button")).toBeDisabled();
  });
});
