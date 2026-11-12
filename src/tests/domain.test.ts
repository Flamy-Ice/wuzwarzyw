import { describe,it,expect } from 'vitest';
import { fixtures as f } from '../data/fixtures';
import { classifyPostal, normalizePostal } from '../domain/postal';
import { upcomingDates, warsawDate } from '../domain/delivery';
import { pricing } from '../domain/pricing';
import { createOrder, transition, contactErrors, emptyContact, validateCart } from '../domain/order';
import { createRepository, decode } from '../data/repository';
import type { Cart } from '../domain/types';
const now = new Date('2026-11-05T12:00:00Z');
const cart: Cart = {boxId:'medium',postalCode:f.postal.supportedPostalCodes[0],deliveryDate:upcomingDates(now)[0],quantities:{},coupon:null};
describe('kod',()=>{
  it.each(['60001',' 60-001 ',' 60 001 '])('normalizuje %s',code=>expect(normalizePostal(code)).toBe('60-001'));
  it.each(['','12','abc','123456'])('odrzuca %s',code=>expect(classifyPostal(code)).toBe('invalid'));
  it('odróżnia strefy',()=>{for(const code of f.postal.supportedPostalCodes) expect(classifyPostal(code)).toBe('supported'); expect(classifyPostal(f.postal.unsupportedPostalCodes[0])).toBe('unsupported');expect(classifyPostal('99-999')).toBe('unknown');});
});
describe('pieniądze',()=>{
  it.each(f.boxes)('pełna cena $id',box=>expect(pricing({...cart,boxId:box.id}).total).toBe(box.priceGrosze+box.shippingGrosze));
  it('dodatki i jednorazowy rabat',()=>{ const quantities={[f.addons[0].id]:2}; const base=pricing({...cart,quantities}); const discounted=pricing({...cart,quantities,coupon:f.coupon.code});expect(base.addons).toBe(f.addons[0].priceGrosze*2);expect(discounted.total).toBe(base.total-f.coupon.discountGrosze);expect(discounted.total).toBeGreaterThanOrEqual(0); expect(pricing({...cart,coupon:f.coupon.code}).total).toBeGreaterThanOrEqual(0); });
  it.each([-1,.5,NaN,Infinity])('blokuje ilość %s',n=>expect(()=>pricing({...cart,quantities:{eggs:n}})).toThrow());
  it('blokuje nieznany produkt i nadmiar',()=>{expect(()=>pricing({...cart,quantities:{nope:1}})).toThrow();expect(()=>pricing({...cart,quantities:{eggs:f.addons[0].maxQty+1}})).toThrow();});
});
describe('terminy warszawskie',()=>{
  it.each(['2026-11-05T12:00:00Z','2026-12-31T23:30:00Z','2026-03-28T23:30:00Z','2026-10-24T23:30:00Z'])('tylko przyszłe dni %s',input=>{const clock=new Date(input), dates=upcomingDates(clock);expect(dates).toHaveLength(f.delivery.numberOfUpcomingOptions);expect(new Set(dates).size).toBe(dates.length);for(const date of dates){expect(date>warsawDate(clock)).toBe(true);expect(f.delivery.demoDaysOfWeekISO).toContain(new Date(`${date}T12:00Z`).getUTCDay());}});
  it('uwzględnia północ w Polsce',()=>expect(warsawDate(new Date('2026-12-31T23:30:00Z'))).toBe('2027-01-01'));
});
describe('zamówienie i zapis',()=>{
  it('odrzuca niespełnione warunki',()=>{expect(()=>createOrder(cart,false,now)).toThrow();expect(()=>validateCart({...cart,postalCode:'99-999'},now)).toThrow();expect(()=>validateCart({...cart,deliveryDate:'2000-01-01'},now)).toThrow();expect(()=>validateCart({...cart,coupon:'BAD'},now)).toThrow();});
  it('przechodzi tylko do dozwolonych stanów',()=>{const order=createOrder(cart,true,now,'test');const paused=transition(order,'paused',now);expect(transition(paused,'active',now).status).toBe('active');const canceled=transition(paused,'canceled',now);expect(()=>transition(canceled,'active')).toThrow();expect(()=>transition(order,'active')).toThrow();});
  it('serializuje tylko dozwolone pola',()=>{const order=createOrder(cart,true,now,'test');expect(decode(JSON.stringify({...order,email:'secret'}))).toEqual(order);expect(decode(JSON.stringify({...order,boxId:'corrupt'}))).toBeNull();expect(decode(JSON.stringify({...order,version:99}))).toBeNull();});
  it('fallback zachowuje zmiany do końca sesji',()=>{const repo=createRepository(()=>{throw Error('disabled');});const order=createOrder(cart,true,now,'fallback');repo.save(order);expect(repo.read()).toEqual(order);repo.clear();expect(repo.read()).toBeNull();});
  it('waliduje kontakt przed przeglądem',()=>{expect(Object.keys(contactErrors(emptyContact))).toHaveLength(4);expect(contactErrors({name:'Test',email:'test@example.com',phone:'+48 123 456 789',street:'Testowa 1',city:'Poznań'})).toEqual({});});
});
