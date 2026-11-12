import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { fixtures as f } from '../src/data/fixtures';
import { createOrder } from '../src/domain/order';
import { upcomingDates } from '../src/domain/delivery';
import { money, pricing } from '../src/domain/pricing';
const widths=[320,360,390,768,1024,1440];
test.use({ reducedMotion: 'reduce' });
async function layout(page:Page,name:string) {
  for(const width of widths) {await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${name} ${width}`).toBe(true);}
}
async function a11y(page:Page) {
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
}
async function supported(page:Page){await page.getByLabel('Twój kod pocztowy',{exact:true}).fill(f.postal.supportedPostalCodes[0]);await page.getByRole('button',{name:'Sprawdź dostawę',exact:true}).click();await expect(page.getByText('Kod 60-001 sprawdzony pozytywnie')).toBeVisible();}
test('P0: layout i axe landing, checkout oraz panel',async({page})=>{
  await page.goto('/');await layout(page,'landing');await a11y(page);
  await page.setViewportSize({width:360,height:900});await a11y(page);await page.setViewportSize({width:1440,height:900});
  await page.getByRole('tab').first().focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab').nth(1)).toBeFocused();
  await page.getByRole('button',{name:'Zobacz przepis'}).first().click();await a11y(page);await page.keyboard.press('Escape');
  await page.goto('/zamow');await layout(page,'dostawa');await a11y(page);await supported(page);
  const options=await page.getByLabel('Wybierz termin').locator('option').allTextContents();expect(options).toHaveLength(f.delivery.numberOfUpcomingOptions);
  await page.getByRole('button',{name:'Dalej: skrzynka'}).click();await layout(page,'skrzynka');await a11y(page);
  const summary=page.getByRole('complementary',{name:'Koszt zamówienia'});
  for(const box of f.boxes){await page.getByRole('radio',{name:new RegExp(box.label)}).check();await expect(summary.locator('.order-total strong')).toHaveText(money(pricing({boxId:box.id,quantities:{},coupon:null}).total));}
  await page.getByLabel('Jajka',{exact:false}).selectOption('2');
  await page.getByLabel('Kupon',{exact:true}).fill(f.coupon.code);await page.getByRole('button',{name:'Zastosuj kupon'}).click();
  const withExtras=pricing({boxId:'large',quantities:{eggs:2},coupon:f.coupon.code}).total;
  await expect(summary.locator('.order-total strong')).toHaveText(money(withExtras));
  await page.getByRole('button',{name:'Usuń kupon'}).click();await expect(summary.locator('.order-total strong')).toHaveText(money(withExtras+f.coupon.discountGrosze));
  await page.getByRole('button',{name:'Dalej: dane'}).click();await layout(page,'dane');await a11y(page);
  for(const [label,value] of [['Imię','Fikcyjne'],['E-mail','demo@example.com'],['Ulica i numer','Przykładowa 1'],['Miejscowość','Poznań']])await page.getByLabel(label,{exact:false}).fill(value);
  await page.getByRole('button',{name:'Dalej: podsumowanie'}).click();await layout(page,'podsumowanie');await a11y(page);
  await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();window.scrollTo(0,0);});await page.screenshot({path:'test-results/checkout-desktop.png',fullPage:true});
  await page.setViewportSize({width:360,height:900});await a11y(page);await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();window.scrollTo(0,0);});await page.screenshot({path:'test-results/checkout-mobile.png',fullPage:true});
  await page.getByRole('button',{name:'Potwierdź konfigurację'}).click();await expect(page.getByRole('alert')).toContainText('Potwierdź zgodę');await expect(page.getByLabel('Zgadzam się na lokalny zapis',{exact:false})).toBeFocused();
  await page.getByLabel('Zgadzam się na lokalny zapis',{exact:false}).check();await page.getByRole('button',{name:'Potwierdź konfigurację'}).click();await layout(page,'potwierdzenie');await a11y(page);
  await page.getByRole('link',{name:'Przejdź do swojego panelu'}).click();await layout(page,'panel');await a11y(page);
  await page.evaluate(()=>{(document.activeElement as HTMLElement)?.blur();window.scrollTo(0,0);});await page.screenshot({path:'test-results/panel-desktop.png',fullPage:true});
});
test('P0: klawiatura menu, formularz, radio i dialog oraz fallback schowka',async({page})=>{
  await page.setViewportSize({width:360,height:900});await page.goto('/');
  const menu=page.getByRole('button',{name:'Menu'});await menu.focus();await page.keyboard.press('Enter');await expect(menu).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Tab');await expect(page.getByRole('navigation').getByRole('link',{name:'Co w skrzynce?'})).toBeFocused();
  await page.goto('/zamow');const input=page.getByLabel('Twój kod pocztowy',{exact:true});await input.focus();await page.keyboard.type(f.postal.supportedPostalCodes[0]);await page.keyboard.press('Enter');await expect(page.getByText('Kod 60-001 sprawdzony pozytywnie')).toBeVisible();
  await page.getByRole('button',{name:'Dalej: skrzynka'}).focus();await page.keyboard.press('Enter');await expect(page.getByRole('heading',{name:'Dopasuj swoją skrzynkę'})).toBeFocused();
  await page.getByRole('radio',{name:/Mała skrzynka/}).focus();await page.keyboard.press('ArrowDown');await expect(page.getByRole('radio',{name:/Średnia skrzynka/})).toBeChecked();
  await page.goto('/panel');await page.getByRole('button',{name:'Wczytaj gotowy zestaw'}).focus();await page.keyboard.press('Enter');
  await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('blocked'))},configurable:true});});
  await page.getByRole('button',{name:'Kopiuj kod'}).focus();await page.keyboard.press('Enter');await expect(page.getByText('Przeglądarka blokuje schowek.',{exact:false})).toBeVisible();await expect(page.getByLabel('Twój kod polecenia')).toBeFocused();
});
test('P0: zmiana zweryfikowanego kodu blokuje dane i zachowuje wariant',async({page})=>{
  await page.goto('/');await page.locator('.box').last().getByRole('link').click();await expect(page.getByText('Wybrany wariant:')).toContainText('Duża skrzynka');
  await supported(page);await page.getByLabel('Twój kod pocztowy',{exact:true}).fill('99-999');await page.getByRole('button',{name:'Dalej: skrzynka'}).click();await expect(page.getByRole('heading',{name:'Sprawdź dostawę i termin'})).toBeVisible();await expect(page.getByLabel('Imię',{exact:false})).toHaveCount(0);
  await supported(page);await page.getByRole('button',{name:'Dalej: skrzynka'}).click();await expect(page.getByRole('radio',{name:/Duża skrzynka/})).toBeChecked();await page.getByRole('button',{name:'← Wstecz'}).click();await expect(page.getByText('Wybrany wariant:')).toContainText('Duża skrzynka');
});
test('P0: uszkodzony zapis, stary termin, brak storage i pusty sukces',async({page})=>{
  await page.goto('/zamow/potwierdzenie');await expect(page.getByRole('heading',{name:'Brak zapisanej skrzynki'})).toBeVisible();
  for(const raw of ['{bad',JSON.stringify({version:99}),JSON.stringify({version:1,boxId:'bad'})]){await page.evaluate(v=>localStorage.setItem('wuzwarzyw.demo.v1',v),raw);await page.goto('/panel');await expect(page.getByRole('heading',{name:'Tu pojawi się Twoja skrzynka'})).toBeVisible();}
  const record=createOrder({boxId:'small',postalCode:f.postal.supportedPostalCodes[0],deliveryDate:upcomingDates()[0],quantities:{},coupon:null},true);
  record.deliveryDate='2000-01-01';await page.evaluate(r=>localStorage.setItem('wuzwarzyw.demo.v1',JSON.stringify(r)),record);await page.reload();await expect(page.getByText('Pierwotny termin minął.',{exact:false})).toBeVisible();
  await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('disabled for test');}});});await page.reload();await page.getByRole('button',{name:'Wczytaj gotowy zestaw'}).click();await expect(page.getByText('Status: Aktywna')).toBeVisible();await expect(page.getByText('Zmiany są dostępne tylko w tej sesji',{exact:false})).toBeVisible();await page.getByRole('button',{name:'Wstrzymaj następne dostawy'}).click();await expect(page.getByText('Status: Wstrzymana')).toBeVisible();
});
test('P0: nawigacja i brak zewnętrznych żądań biznesowych',async({page})=>{
  const external:string[]=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:5173')&&!r.url().startsWith('data:'))external.push(r.url());});
  await page.goto('/');
  const links=await page.locator('header a, footer a').evaluateAll(els=>els.map(el=>el.getAttribute('href')!));
  for(const href of links){expect(href).not.toBe('#');await page.goto(href);await expect(page.getByRole('heading',{name:'Nie znaleziono strony'})).toHaveCount(0);if(href.includes('#'))await expect(page.locator(`#${href.split('#')[1]}`)).toHaveCount(1);}
  await page.goto('/nie-istnieje');await expect(page.getByRole('heading',{name:'Nie znaleziono strony'})).toBeVisible();expect(external).toEqual([]);
});
