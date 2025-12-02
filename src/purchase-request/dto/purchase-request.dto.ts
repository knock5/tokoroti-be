import { z } from 'zod';
import { PurchaseRequestStatus } from '../../generated/prisma/client';

export const PurchaseRequestSchema = z.object({
  itemId: z.number().int().positive(),
  qty: z
    .union([z.string(), z.number()])
    .refine((v) => parseFloat(String(v)) > 0, {
      message: 'qty must be greater than 0',
    }),
  requestedBy: z.number().int().positive().optional(),
  // allow client to pass status (default in prisma is REQUESTED) but optional
  status: z.enum(PurchaseRequestStatus).optional(),
  note: z.string().optional(),
});

export type CreatePurchaseRequestDto = z.infer<typeof PurchaseRequestSchema>;

export type UpdatePurchaseRequestDto = z.infer<
  typeof UpdatePurchaseRequestSchema
>;
export const UpdatePurchaseRequestSchema = PurchaseRequestSchema.partial();
