import { z } from 'zod';
import { Role } from '../../generated/prisma/client';

export const CreateUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().optional(),
  role: z.enum(Role).optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
