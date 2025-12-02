import { z } from 'zod';
import { TransactionType } from '../../generated/prisma/client';

export const CreateStockTransactionSchema = z.object({
  itemId: z.number().int().positive(),
  qty: z
    .union([z.string(), z.number()])
    .refine((v) => parseFloat(String(v)) > 0, {
      message: 'qty must be greater than 0',
    }),
  type: z.enum(TransactionType),
  unitPrice: z.union([z.string(), z.number()]).optional(),
  note: z.string().optional(),
  createdBy: z.number().int().positive().optional(),
});

export type CreateStockTransactionDto = z.infer<
  typeof CreateStockTransactionSchema
>;

export const UpdateStockTransactionSchema =
  CreateStockTransactionSchema.partial();
export type UpdateStockTransactionDto = z.infer<
  typeof UpdateStockTransactionSchema
>;
