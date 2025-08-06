import { plainToInstance } from 'class-transformer';
import {
  ValidationError,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
  IsEnum,
} from 'class-validator';

enum Environment {
  DEVELOPMENT = 'development',
  LOCAL = 'local',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_HOST!: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DATABASE_PORT!: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig: EnvironmentVariables = plainToInstance(
    EnvironmentVariables,
    config,
    {
      enableImplicitConversion: true,
    },
  );

  const errors: ValidationError[] = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
