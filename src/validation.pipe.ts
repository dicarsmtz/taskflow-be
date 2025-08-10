import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodType } from 'zod';
import { SignInSchema, SignUpSchema } from './auth/auth.validation';
import { ClassConstructor, plainToInstance } from 'class-transformer';

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
      const klass = metadata.metatype as ClassConstructor<any>;
      const res = plainToInstance(klass, result.data) as object;

      return res;
    }

    // transform to a detailed response
    throw new BadRequestException('Validation failed', {
      cause: result.error,
    });
  }
}

const schemas: ZodSchemas = {
  SignInDto: SignInSchema,
  SignUpDto: SignUpSchema,
};

const pipe = new ZodValidationPipe(schemas);

export default pipe;
