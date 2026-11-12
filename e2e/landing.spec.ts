import { test, expect } from '@playwright/test';
test.use({ reducedMotion: 'reduce' });
test('landing: responsive, tygodnie, profile, przepisy i menu', async ({ page }) => {
  await page.goto('/');
  for(const width of [320,360,390,768,1024,1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  for (const section of await page.locator('main > section').all()) await section.scrollIntoViewIfNeeded();
  await page.locator('img').evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())));
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo(0,0); });
  await page.screenshot({ path: 'test-results/landing-desktop.png', fullPage: true });
  for(const tab of await page.getByRole('tab').all()) { await tab.click(); await expect(tab).toHaveAttribute('aria-selected','true'); }
  await page.getByRole('button',{name:'Poznaj wszystkie gospodarstwa', exact:false}).click();
  const profiles=page.getByRole('button',{name:'Poznaj profil'});
  await expect(profiles).toHaveCount(12);
  for(const profile of await profiles.all()) { await profile.click(); await expect(page.getByRole('dialog')).toBeVisible(); await page.keyboard.press('Escape'); await expect(profile).toBeFocused(); }
  for(const recipe of await page.getByRole('button',{name:'Zobacz przepis'}).all()) { await recipe.click(); await expect(page.getByRole('heading',{name:'Przygotowanie'})).toBeVisible(); await page.keyboard.press('Escape'); }
  for(const summary of await page.locator('summary').all()) { await summary.click(); await expect(summary.locator('..')).toHaveAttribute('open',''); }
  await page.setViewportSize({width:360,height:900}); await page.goto('/');
  for (const section of await page.locator('main > section').all()) await section.scrollIntoViewIfNeeded();
  await page.locator('img').evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())));
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo(0,0); });
  await page.screenshot({path:'test-results/landing-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Menu'}).click(); await page.getByRole('navigation').getByRole('link',{name:'Nasze skrzynki'}).click();
  await expect(page.getByRole('button',{name:'Menu'})).toHaveAttribute('aria-expanded','false');
});
