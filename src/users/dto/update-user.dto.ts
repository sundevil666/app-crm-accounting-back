import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { z } from 'zod';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: number;
  avatar?: string
}

export const UpdateUserDtoSchema = z.object({
  id: z.number(),
  avatar: z.string().optional(),
})
  .required()

export type UpdateUserDtoType = z.infer<typeof UpdateUserDtoSchema>;
