import { expect, test } from '@playwright/test';

test('landing page renders hero and CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Decentralized SQL/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Open the SQL workbench/i })).toBeVisible();
});

test('app routes load with sidebar', async ({ page }) => {
  for (const path of ['/query', '/tables', '/upload', '/policies']) {
    await page.goto(path);
    await expect(page.getByRole('main')).toBeVisible();
  }
});

test('navigation between sidebar links works', async ({ page }) => {
  await page.goto('/query');
  await page.getByRole('link', { name: /Tables/i }).first().click();
  await expect(page).toHaveURL(/\/tables/);
  await page.getByRole('link', { name: /Upload/i }).first().click();
  await expect(page).toHaveURL(/\/upload/);
});

test('policies page shows wallet-not-connected state', async ({ page }) => {
  await page.goto('/policies');
  await expect(page.getByRole('heading', { name: /Connect your wallet/i })).toBeVisible();
});
