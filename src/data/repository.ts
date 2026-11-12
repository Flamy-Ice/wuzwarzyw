import { z } from 'zod';
import { boxId, fixtures } from './fixtures';
import type { Subscription } from '../domain/types';
export const STORAGE_KEY = 'wuzwarzyw.demo.v1';
const schema = z.object({ version: z.literal(1), id: z.string().min(1), status: z.enum(['active', 'paused', 'canceled']), boxId, postalCode: z.string().refine(v => fixtures.postal.supportedPostalCodes.includes(v)), deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => !Number.isNaN(Date.parse(v))), quantities: z.record(z.string(), z.number().int().nonnegative()).refine(q => Object.entries(q).every(([id,n]) => fixtures.addons.some(a => a.id === id && n <= a.maxQty))), coupon: z.string().nullable().refine(v => v === null || v === fixtures.coupon.code), createdAt: z.iso.datetime(), updatedAt: z.iso.datetime() });
export function decode(value: string | null): Subscription | null { try { return schema.parse(JSON.parse(value ?? 'null')); } catch { return null; } }
export function createRepository(getStorage: () => Storage = () => localStorage) {
  let memory: Subscription | null = null;
  let sessionOnly = false;
  return {
    get sessionOnly() { return sessionOnly; },
    read() { try { if (!sessionOnly) memory = decode(getStorage().getItem(STORAGE_KEY)); } catch { sessionOnly = true; } return memory; },
    save(value: Subscription) { memory = schema.parse(value); try { getStorage().setItem(STORAGE_KEY, JSON.stringify(memory)); } catch { sessionOnly = true; } },
    clear() { memory = null; try { getStorage().removeItem(STORAGE_KEY); } catch { sessionOnly = true; } }
  };
}
export const repository = createRepository();
