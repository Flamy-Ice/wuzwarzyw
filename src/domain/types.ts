export type BoxId = 'small' | 'medium' | 'large';
export type Status = 'active' | 'paused' | 'canceled';
export type Cart = { boxId: BoxId; postalCode: string; deliveryDate: string; quantities: Record<string, number>; coupon: string | null };
export type Subscription = Cart & { version: 1; id: string; status: Status; createdAt: string; updatedAt: string };
