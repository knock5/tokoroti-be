import { z } from 'zod';
import { Role } from '../../generated/prisma/client';

export const UpdateUserSchema = z.object({
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().optional(),
  role: z.enum(Role).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
