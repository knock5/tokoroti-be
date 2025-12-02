import { z } from 'zod';

export const CreateStockOpnameItemSchema = z.object({
  itemId: z.number().int().positive(),
  qtyPhysical: z
    .union([z.string(), z.number()])
    .refine((v) => parseFloat(String(v)) >= 0, {
      message: 'qtyPhysical harus >= 0',
    }),
  note: z.string().optional(),
});

export const CreateStockOpnameSchema = z.object({
  date: z
    .union([z.string(), z.date()])
    .optional()
    .transform((v) => {
      if (!v) return undefined;
      const d = new Date(v);
      return isNaN(d.getTime()) ? undefined : d;
    }),
  createdBy: z.number().int().positive().optional(),
  note: z.string().optional(),
  items: z.array(CreateStockOpnameItemSchema).min(1),
  autoAdjust: z.boolean().optional().default(true),
});

export type CreateStockOpnameDto = z.infer<typeof CreateStockOpnameSchema>;
export type CreateStockOpnameItemDto = z.infer<
  typeof CreateStockOpnameItemSchema
>;

export const UpdateStockOpnameSchema = CreateStockOpnameSchema.partial();
export type UpdateStockOpnameDto = z.infer<typeof UpdateStockOpnameSchema>;

export const UpdateStockOpnameItemSchema =
  CreateStockOpnameItemSchema.partial();
export type UpdateStockOpnameItemDto = z.infer<
  typeof UpdateStockOpnameItemSchema
>;
