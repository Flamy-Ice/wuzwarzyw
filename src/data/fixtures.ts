import { z } from 'zod';
import raw from '../../data/demo-fixtures.json' with { type: 'json' };
const money = z.number().int().nonnegative();
export const boxId = z.enum(['small', 'medium', 'large']);
const text = z.string().min(1);
const schema = z.object({
  meta: z.object({ brand: z.literal('wuzwarzyw'), mode: z.literal('DEMO'), notForRealOrders: z.literal(true) }),
  postal: z.object({ supportedPostalCodes: z.array(text).nonempty(), unsupportedPostalCodes: z.array(text) }),
  delivery: z.object({ demoDaysOfWeekISO: z.array(z.number().int().min(1).max(7)).nonempty(), timezone: text, numberOfUpcomingOptions: z.number().int().positive() }),
  boxes: z.array(z.object({ id: boxId, label: text, sizeNote: text, description: text, priceGrosze: money, shippingGrosze: money, estimatedWeight: text, illustrativeCount: text })).length(3),
  addons: z.array(z.object({ id: text, label: text, priceGrosze: money, maxQty: z.number().int().positive() })),
  coupon: z.object({ code: text, discountGrosze: money }),
  weeks: z.array(z.object({ id: text, label: text, items: z.array(z.object({ name: text, quantity: text })).nonempty() })).length(5),
  farmers: z.array(z.object({ id: text, displayName: text, specialty: text, area: text, description: text, verified: z.literal(false) })).length(12),
  recipes: z.array(z.object({ id: text, title: text, durationMin: z.number().positive(), ingredients: z.array(text).nonempty(), steps: z.array(text).nonempty() })).nonempty(),
  referral: z.object({ demoCode: text })
});
export function parseFixtures(input: unknown) { return schema.parse(input); }
export const fixtures = parseFixtures(raw);
