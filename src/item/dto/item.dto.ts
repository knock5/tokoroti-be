import { z } from 'zod';

export const ItemSchema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  minStock: z.union([z.string(), z.number()]).optional(),
  stock: z.union([z.string(), z.number()]).optional(),
});

export type CreateItemDto = z.infer<typeof ItemSchema>;

export type UpdateItemDto = z.infer<typeof UpdateItemSchema>;
export const UpdateItemSchema = ItemSchema.partial();
