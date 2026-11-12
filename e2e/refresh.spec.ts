import { test, expect } from '@playwright/test';

test('fotografie są lokalne i kompletne; etykiety techniczne zniknęły', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const section of await page.locator('main > section').all()) await section.scrollIntoViewIfNeeded();
  const photos = await page.locator('img[src^="/images/"]').evaluateAll(images => Promise.all(images.map(async image => {
    const photo = image as HTMLImageElement; await photo.decode();
    return { width: photo.naturalWidth, loaded: photo.complete, source: image.getAttribute('src') };
  })));
  expect(photos).toHaveLength(6);
  expect(photos.every(photo => photo.loaded && photo.width > 0)).toBe(true);
  expect(await page.locator('.farm-photo').first().evaluate(element => getComputedStyle(element).backgroundImage)).toContain('/images/farm-grid.jpg');
  expect(await page.locator('body').innerText()).not.toMatch(/\bDEMO\b|demonstracyj|prototyp/iu);
  await page.getByRole('button', { name: 'Zobacz przepis' }).first().click();
  await expect(page.getByRole('dialog').locator('.dialog-photo')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.goto('/zamow');
  expect(await page.locator('body').innerText()).not.toMatch(/\bDEMO\b|demonstracyj|prototyp/iu);
  await page.goto('/panel');
  await page.getByRole('button', { name: 'Wczytaj gotowy zestaw' }).click();
  expect(await page.locator('body').innerText()).not.toMatch(/\bDEMO\b|demonstracyj|prototyp/iu);
});

test('animacje, hover, postęp przewijania i ograniczenie ruchu', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.hero-visual')).toHaveCSS('animation-name', 'hero-in');
  const box = page.locator('.box').first();
  await box.hover();
  await expect.poll(() => box.evaluate(element => getComputedStyle(element).transform)).not.toBe('none');
  await page.locator('#faq').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => Number(document.documentElement.style.getPropertyValue('--reading-progress')))).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-visual')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.recipe-photo img').first()).toHaveCSS('transition-duration', '0s');
});
