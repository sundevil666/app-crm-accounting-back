import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      if(typeof value === 'object') {
        this.schema.parse(value);
      }
    } catch (error) {
      const data = error.issues.map((item: { path: string; message: string; code: string }) => {
        return {
          path: item.path,
          code: item.code,
          message: item.message,
        };
      })
      throw new BadRequestException(data);
    }
    return value;
  }
}
