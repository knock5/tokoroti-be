import { z } from 'zod';
import { PurchaseOrderStatus } from '../../generated/prisma/client';

export const PurchaseOrderSchema = z.object({
  itemId: z.number().int().positive(),
  qtyOrdered: z
    .union([z.string(), z.number()])
    .refine((v) => parseFloat(String(v)) > 0, {
      message: 'qtyOrdered must be greater than 0',
    }),
  createdById: z.number().int().positive().optional(),
  approvedById: z.number().int().positive().optional(),
  note: z.string().optional(),
  status: z.enum(PurchaseOrderStatus).optional(),
});
export type CreatePurchaseOrderDto = z.infer<typeof PurchaseOrderSchema>;

export const UpdatePurchaseOrderSchema = PurchaseOrderSchema.partial();
export type UpdatePurchaseOrderDto = z.infer<typeof UpdatePurchaseOrderSchema>;
