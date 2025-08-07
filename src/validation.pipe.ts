import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodType } from 'zod';
import { SignInSchema } from './auth/auth.validation';

type ZodSchemas = Record<string, ZodType>;

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schemas: ZodSchemas) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const key = metadata.metatype?.name;
    const schema = key ? this.schemas[key] : undefined;

    if (!schema) {
      return value;
    }

    const result = schema.safeParse(value);

    if (result.success) {
      return result.data;
    }

    // transform to a detailed response
    throw new BadRequestException('Validation failed');
  }
}

const schemas: ZodSchemas = {
  SignInDto: SignInSchema,
};

const pipe = new ZodValidationPipe(schemas);

export default pipe;
