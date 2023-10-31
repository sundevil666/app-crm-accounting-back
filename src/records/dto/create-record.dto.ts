import { z } from 'zod';
import { OperationType } from 'src/common/operation-type.enum'
export class CreateRecordDto {
  description?: string;
  operationType: OperationType;
  summa: number;
  categoryId: number
}

export const CreateRecordDtoSchema = z.object({
  description: z.string().optional(),
  operationType: z.nativeEnum(OperationType),
  summa: z.number().min(0, 'Summa must be a non-negative number'),
  categoryId: z.number().min(0, 'Category id must be a non-negative number'),
})
  .required()

export type CreateRecordDtoType = z.infer<typeof CreateRecordDtoSchema>;
