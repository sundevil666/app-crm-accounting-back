import { z } from 'zod';
export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export const CreateUserDtoSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email'),
  password: z.string().min(3, 'Password must be at least 3 characters long'),
  avatar: z.string().optional(),
})

export type CreateUserDtoType = z.infer<typeof CreateUserDtoSchema>;
