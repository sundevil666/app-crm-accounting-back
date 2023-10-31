import { z } from 'zod';

export class CreateCategoryDto {
  id?: number;
  description?: string;
  title: string;
  limit: number;
}

export const CreateCategoryDtoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 2 characters long'),
  limit: z.number().positive('Limit must be at least 0'),
  description: z.string().optional(),
  id: z.number().optional(),
})

export type CreateCategoryDtoType = z.infer<typeof CreateCategoryDtoSchema>;

