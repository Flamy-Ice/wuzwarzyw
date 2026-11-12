import { fixtures } from '../data/fixtures';
import type { Cart } from './types';
export const money = (grosze: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(grosze / 100);
export function pricing(cart: Pick<Cart, 'boxId' | 'quantities' | 'coupon'>) {
  const box = fixtures.boxes.find(b => b.id === cart.boxId);
  if (!box) throw Error('Nieznana skrzynka');
  if (!Object.entries(cart.quantities).every(([id,n]) => Number.isInteger(n) && n >= 0 && fixtures.addons.some(a => a.id === id && n <= a.maxQty))) throw Error('Nieprawidłowe dodatki');
  const addons = fixtures.addons.reduce((sum,a) => sum + (cart.quantities[a.id] ?? 0) * a.priceGrosze, 0);
  const subtotal = box.priceGrosze + box.shippingGrosze + addons;
  const discount = cart.coupon === fixtures.coupon.code ? Math.min(fixtures.coupon.discountGrosze, subtotal) : 0;
  return { box: box.priceGrosze, shipping: box.shippingGrosze, addons, subtotal, discount, total: subtotal - discount };
}
