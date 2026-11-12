import { fixtures } from '../data/fixtures';
import { upcomingDates } from './delivery';
import { classifyPostal, normalizePostal } from './postal';
import { pricing } from './pricing';
import type { Cart, Status, Subscription } from './types';
export function validateCart(cart: Cart, now = new Date()) {
  if(classifyPostal(cart.postalCode) !== 'supported') throw Error('Sprawdź kod pocztowy przed zamówieniem.');
  if(!upcomingDates(now).includes(cart.deliveryDate)) throw Error('Wybierz aktualny przyszły termin.');
  if(cart.coupon !== null && cart.coupon !== fixtures.coupon.code) throw Error('Nieprawidłowy kupon.');
  pricing(cart);
}
export function createOrder(cart: Cart, consent: boolean, now = new Date(), id: string = crypto.randomUUID()): Subscription {
  validateCart(cart,now);
  if(!consent) throw Error('Potwierdź zgodę na zapis ustawień.');
  return {version:1,id:`WZ-${id}`,status:'active',boxId:cart.boxId,postalCode:normalizePostal(cart.postalCode),deliveryDate:cart.deliveryDate,quantities:{...cart.quantities},coupon:cart.coupon,createdAt:now.toISOString(),updatedAt:now.toISOString()};
}
export function transition(record: Subscription, status: Status, now = new Date()): Subscription {
  const allowed: Record<Status, Status[]> = { active:['paused','canceled'],paused:['active','canceled'],canceled:[] };
  if(!allowed[record.status].includes(status)) throw Error('Niedozwolona zmiana statusu.');
  return {...record,status,updatedAt:now.toISOString()};
}
export type Contact = { name: string; email: string; phone: string; street: string; city: string };
export const emptyContact: Contact = {name:'',email:'',phone:'',street:'',city:''};
export function contactErrors(contact: Contact): Partial<Record<keyof Contact,string>> {
  const errors: Partial<Record<keyof Contact,string>> = {};
  if(contact.name.trim().length<2) errors.name='Wpisz imię (co najmniej dwa znaki).';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errors.email='Wpisz poprawny adres e-mail.';
  if(contact.phone && !/^(\+48)?\d{9}$/.test(contact.phone.replace(/[\s-]/g,''))) errors.phone='Wpisz numer z dziewięcioma cyframi lub pozostaw pole puste.';
  if(contact.street.trim().length<3) errors.street='Wpisz ulicę i numer.';
  if(contact.city.trim().length<2) errors.city='Wpisz miejscowość.';
  return errors;
}
