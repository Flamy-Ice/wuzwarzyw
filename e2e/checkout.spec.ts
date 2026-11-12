import { test, expect, type Page } from '@playwright/test';
import { fixtures as f } from '../src/data/fixtures';
export async function configure(page:Page) {
  await page.goto('/');
  await page.locator('.box').nth(1).getByRole('link',{name:'Wybieram tę skrzynkę'}).click();
  await expect(page.getByRole('heading',{name:'Sprawdź dostawę i termin'})).toBeVisible();
  await page.getByLabel('Twój kod pocztowy',{exact:true}).fill(' 60001 ');await page.getByRole('button',{name:'Sprawdź dostawę',exact:true}).click();
  await expect(page.getByText('Kod 60-001 sprawdzony pozytywnie')).toBeVisible();
  await page.getByRole('button',{name:'Dalej: skrzynka'}).click();
  await page.getByLabel('Jajka', {exact:false}).selectOption('2');
  await page.getByLabel('Kupon',{exact:true}).fill(f.coupon.code);await page.getByRole('button',{name:'Zastosuj kupon'}).click();
  await expect(page.getByText('Kupon zastosowany', {exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Dalej: dane'}).click();
  await page.getByRole('button',{name:'Dalej: podsumowanie'}).click();
  await expect(page.getByLabel('Imię',{exact:false})).toBeFocused();
  await page.getByLabel('Imię',{exact:false}).fill('Testowa');
  await page.getByLabel('E-mail',{exact:false}).fill('test@example.com');
  await page.getByLabel('Ulica i numer',{exact:false}).fill('Fikcyjna 1');
  await page.getByLabel('Miejscowość',{exact:false}).fill('Poznań');
  await page.getByRole('button',{name:'Dalej: podsumowanie'}).click();
  await page.getByLabel('Zgadzam się na lokalny zapis',{exact:false}).check();
  await page.getByRole('button',{name:'Potwierdź konfigurację'}).dblclick();
  await expect(page).toHaveURL(/potwierdzenie/);
}
test('zamówienie DEMO, walidacja, prywatność i refresh',async({page})=>{
  await configure(page);
  const data=await page.evaluate(()=>localStorage.getItem('wuzwarzyw.demo.v1'));
  expect(data).toBeTruthy();expect(data).not.toMatch(/Testowa|test@example|Fikcyjna|email|phone|street|name/);
  await page.reload();await expect(page.getByRole('heading',{name:'Twoja skrzynka jest skonfigurowana.'})).toBeVisible();
  await page.getByRole('link',{name:'Przejdź do swojego panelu'}).click();
  await expect(page.getByText('Status: Aktywna')).toBeVisible();
  await page.getByRole('button',{name:'Wstrzymaj następne dostawy'}).click();await page.reload();await expect(page.getByText('Status: Wstrzymana')).toBeVisible();
  await page.getByRole('button',{name:'Wznów dostawy'}).click();await page.reload();await expect(page.getByText('Status: Aktywna')).toBeVisible();
  await page.getByRole('button',{name:'Anuluj subskrypcję',exact:true}).click();await page.reload();await expect(page.getByText('Status: Anulowana')).toBeVisible();
  await expect(page.getByRole('button',{name:'Wznów dostawy'})).toHaveCount(0);
  await expect(page.getByRole('link',{name:'Skonfiguruj nową skrzynkę'})).toBeVisible();
  await page.context().grantPermissions(['clipboard-read','clipboard-write']);
  await page.getByRole('button',{name:'Kopiuj kod'}).click();await expect(page.getByText('Kod skopiowany.')).toBeVisible();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(f.referral.demoCode);
  await page.getByRole('button',{name:'Wyczyść ustawienia'}).click();await expect(page.getByRole('heading',{name:'Tu pojawi się Twoja skrzynka'})).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('wuzwarzyw.demo.v1'))).toBeNull();
});
test('negatywny kod, unknown i Enter nie omijają walidacji',async({page})=>{
  await page.goto('/zamow');
  for(const code of ['', '12', 'abc', f.postal.unsupportedPostalCodes[0], '99-999']) {
    const input=page.getByLabel('Twój kod pocztowy',{exact:true}); await input.fill(code);await input.press('Enter');
    await expect(input).toHaveAttribute('aria-invalid','true');
    await page.getByRole('button',{name:'Dalej: skrzynka'}).click();await expect(page.getByRole('heading',{name:'Sprawdź dostawę i termin'})).toBeVisible();await expect(page.getByLabel('Imię',{exact:false})).toHaveCount(0);
  }
});
test('pusty panel, seed i synchronizacja między kartami',async({page,context})=>{
  await page.goto('/panel');await expect(page.getByRole('heading',{name:'Tu pojawi się Twoja skrzynka'})).toBeVisible();
  await page.getByRole('button',{name:'Wczytaj gotowy zestaw'}).click();await expect(page.getByText('Status: Aktywna')).toBeVisible();
  const second=await context.newPage();await second.goto('/panel');
  await page.getByRole('button',{name:'Wstrzymaj następne dostawy'}).click();await expect(second.getByText('Status: Wstrzymana')).toBeVisible();
  await second.close();
});
