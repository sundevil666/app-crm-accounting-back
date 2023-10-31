import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordDto } from './create-record.dto';
import { z } from 'zod';

export class UpdateRecordDto extends PartialType(CreateRecordDto) {
  id: number
}

export const UpdateRecordDtoSchema = z.object({
  id: z.number(),
})
  .required()

export type UpdateRecordDtoType = z.infer<typeof UpdateRecordDtoSchema>;
